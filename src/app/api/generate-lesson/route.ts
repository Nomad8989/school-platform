import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // 📍 Added for DB access

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { unitTitle, subject } = await req.json();

    // 1. Identify User
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. Fetch Custom Teacher Personality from Admin Settings
    const { data: settings } = await supabase
      .from("school_settings")
      .select("setting_value")
      .eq("setting_key", "ai_instruction")
      .single();

    const teacherPersonality =
      settings?.setting_value || "You are a helpful teacher at Gegee School.";

    // 3. Fetch Recent Mistakes for Personalized Practice
    const { data: mistakes } = await supabase
      .from("student_mistakes")
      .select("word_or_phrase")
      .eq("user_id", user?.id)
      .limit(3);

    const weakPoints =
      mistakes && mistakes.length > 0
        ? `The student is struggling with: ${mistakes.map((m) => m.word_or_phrase).join(", ")}.`
        : "";

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    // 4. The Optimized Prompt (Personality + Mistakes)
    const prompt = `
      ${teacherPersonality}
      
      TASK: Create a 3-step English lesson for a Mongolian student about "${unitTitle}".
      ${weakPoints}

      Format: SINGLE JSON OBJECT ONLY. Use Mongolian Cyrillic.
      
      Schema:
      {
        "step1": {"phraseMongolian": "...", "phraseEnglish": "...", "audioPrompt": "Repeat after me"},
        "step2": {"question": "Translate the sentence", "options": ["word1", "word2", "word3", "word4", "word5", "word6"], "correctAnswer": "correct English sentence"},
        "step3": {"celebrationMessage": "Well done!"}
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response
      .text()
      .replace(/```json|```/gi, "")
      .trim();

    try {
      return NextResponse.json(JSON.parse(text));
    } catch (e) {
      // Return Mongolian fallback if JSON fails
      return NextResponse.json({
        step1: {
          phraseMongolian: "Таны нэр хэн бэ?",
          phraseEnglish: "What is your name?",
          audioPrompt: "Асуултыг давтаж хэлээрэй",
        },
        step2: {
          question: "Translate: Таны нэр хэн бэ?",
          options: ["What", "is", "your", "name", "who", "are"],
          correctAnswer: "what is your name",
        },
        step3: { celebrationMessage: "Маш сайн!" },
      });
    }
  } catch (error) {
    console.error("Critical AI Failure:", error);
    return NextResponse.json({ error: "Teacher is tired" }, { status: 500 });
  }
}

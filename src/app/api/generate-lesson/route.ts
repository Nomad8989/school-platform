import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { unitTitle, subject, difficulty } = await req.json();

    // 1. Get User Session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. Fetch Custom Teacher Instructions
    const { data: settings } = await supabase
      .from("school_settings")
      .select("setting_value")
      .eq("setting_key", "ai_instruction")
      .single();

    // 3. 📍 PERSONALIZATION: Fetch this specific student's mistakes
    const { data: mistakes } = await supabase
      .from("student_mistakes")
      .select("word_or_phrase")
      .eq("user_id", user?.id)
      .order("error_count", { ascending: false })
      .limit(3);

    const weakPoints =
      mistakes?.map((m) => m.word_or_phrase).join(", ") || "none yet";

    const customInstruction =
      settings?.setting_value ||
      "You are an expert teacher at Gegee School in Mongolia.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Build the prompt with "Weak Points" included
    const prompt = `
      ${customInstruction}
      
      STRICT REQUIREMENT: This specific student is struggling with the following concepts or words: ${weakPoints}.
      If possible, incorporate these into the current lesson to help them improve.

      Now, create a 3-step lesson for the subject "${subject}" on the topic "${unitTitle}".
      The student's level is "${difficulty}".

      Return ONLY a JSON object with this exact structure:
      {
        "step1": { "phraseMongolian": "...", "phraseEnglish": "...", "audioPrompt": "..." },
        "step2": { "question": "...", "options": ["...", "...", "..."], "correctAnswer": "..." },
        "step3": { "celebrationMessage": "..." }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json|```/g, "");

    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson" },
      { status: 500 },
    );
  }
}

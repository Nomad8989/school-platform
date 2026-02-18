"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  Mic,
  Sparkles,
  Loader2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { saveProgress } from "./save-action";
import { logMistake } from "./mistake-action";
import { useSpeech } from "@/hooks/use-speech";

export default function ActivityPlayer() {
  const router = useRouter();
  const params = useParams();
  const subjectId = (params?.id as string) || "english";
  const unitId = Number(params?.unitId);

  const { isListening, transcript, startListening, setTranscript } =
    useSpeech();

  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  // 🔊 Synthetic Sound Logic (No MP3s needed!)
  const playSound = (type: "success" | "error" | "victory") => {
    const AudioContextClass =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === "success") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "error") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "victory") {
      // Triumphant Fanfare Chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.1, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        o.start(now + i * 0.08);
        o.stop(now + 1.2);
      });
    }
  };

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch("/api/generate-lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unitTitle: "Daily Lesson",
            subject: subjectId,
          }),
        });
        const data = await res.json();
        setLessonData(data);
      } catch (error) {
        console.error("AI Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [subjectId]);

  // Handle Voice Input Results
  useEffect(() => {
    if (transcript && lessonData?.step1?.phraseEnglish) {
      const target = lessonData.step1.phraseEnglish
        .toLowerCase()
        .replace(/[.,!]/g, "");
      const spoken = transcript.toLowerCase().trim();

      if (spoken.includes(target) || target.includes(spoken)) {
        setIsCorrect(true);
        playSound("success");
        setTimeout(() => {
          setStep(2);
          setIsCorrect(null);
          setTranscript("");
        }, 1500);
      } else {
        setIsCorrect(false);
        playSound("error");
        logMistake(lessonData.step1.phraseEnglish, subjectId);
        setTimeout(() => setIsCorrect(null), 3000);
      }
    }
  }, [transcript, lessonData, setTranscript, subjectId]);

  const checkAnswer = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!lessonData?.step2) return;

      const studentAnswer = selectedWords.join(" ").toLowerCase().trim();
      const correctAnswer =
        lessonData.step2.correctAnswer?.toLowerCase().trim() || "";

      if (studentAnswer === correctAnswer) {
        setIsCorrect(true);
        // 📍 Sound & Confetti Synchronization
        playSound("victory");
        await saveProgress(subjectId, unitId, 150);

        setTimeout(() => {
          setStep(3);
          confetti({
            particleCount: 180,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#3b82f6", "#10b981", "#fbbf24"],
          });
        }, 800);
      } else {
        setIsCorrect(false);
        playSound("error");
        logMistake(lessonData.step2.correctAnswer, subjectId);
        setTimeout(() => setIsCorrect(null), 2000);
      }
    }

    if (step === 3) {
      router.push(`/subject/${subjectId}`);
    }
  };

  const toggleWord = (word: string) => {
    setIsCorrect(null);
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="font-black animate-pulse text-blue-600 uppercase tracking-widest">
          AI is creating your lesson...
        </p>
      </div>
    );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${isCorrect === true ? "bg-green-50" : isCorrect === false ? "bg-red-50" : "bg-white"}`}
    >
      <header className="p-6 flex items-center gap-4 max-w-4xl mx-auto w-full">
        <Link href={`/subject/${subjectId}`}>
          <X className="text-slate-400 hover:text-slate-600" />
        </Link>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-green-500"
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <div className="bg-white p-8 rounded-[3rem] border-4 border-blue-100 shadow-xl text-slate-800">
                <h2 className="text-xl font-bold text-slate-400 mb-4 tracking-tight">
                  {lessonData.step1.audioPrompt}
                </h2>
                <p className="text-4xl font-black text-blue-600 italic mb-2 tracking-tighter">
                  "{lessonData.step1.phraseEnglish}"
                </p>
                <p className="text-lg font-medium text-slate-400">
                  {lessonData.step1.phraseMongolian}
                </p>
              </div>
              <button
                onClick={startListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all mx-auto ${isListening ? "bg-red-600 animate-pulse scale-110" : "bg-red-500 hover:scale-105"}`}
              >
                <Mic size={40} className="text-white" />
              </button>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                {isListening ? "Listening..." : "Tap to Speak"}
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="max-w-md w-full space-y-6"
            >
              <h2 className="text-2xl font-black text-slate-800 text-center tracking-tight">
                {lessonData.step2.question}
              </h2>
              <div
                className={`p-6 rounded-3xl border-4 border-dashed min-h-35 flex flex-wrap gap-2 justify-center items-center transition-all ${isCorrect === false ? "border-red-300 bg-red-100" : "border-slate-200 bg-slate-50"}`}
              >
                {selectedWords.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => toggleWord(word)}
                    className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold text-blue-600 shadow-sm"
                  >
                    {word}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                {lessonData.step2.options?.map((word: string) => (
                  <button
                    key={word}
                    onClick={() => toggleWord(word)}
                    disabled={selectedWords.includes(word)}
                    className="px-5 py-2 bg-white border-2 border-slate-200 border-b-4 rounded-xl font-bold active:border-b-0 active:translate-y-1 disabled:opacity-20 transition-all"
                  >
                    {word}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedWords([])}
                className="w-full text-slate-400 flex justify-center hover:text-slate-600"
              >
                <RotateCcw size={20} />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Sparkles size={60} className="text-amber-900" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
                {lessonData.step3?.celebrationMessage}
              </h2>
              <p className="text-slate-500 font-black text-xl tracking-widest">
                +150 XP EARNED
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer
        className={`p-8 border-t flex flex-col items-center gap-4 ${isCorrect === true ? "bg-green-100 border-green-200" : isCorrect === false ? "bg-red-100 border-red-200" : "bg-white"}`}
      >
        {isCorrect !== null && (
          <div
            className={`flex items-center gap-2 font-black uppercase tracking-tight ${isCorrect ? "text-green-700" : "text-red-700"}`}
          >
            {isCorrect ? <CheckCircle2 /> : <AlertCircle />}
            {isCorrect ? "EXCELLENT!" : "TRY AGAIN!"}
          </div>
        )}
        <button
          onClick={checkAnswer}
          className="w-full max-w-md py-5 bg-green-500 border-b-8 border-green-700 text-white rounded-2xl font-black text-xl hover:brightness-105 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
        >
          {step < totalSteps ? (
            <>
              CHECK ANSWER <ChevronRight size={24} />
            </>
          ) : (
            <>
              RETURN TO MAP <Star size={24} className="fill-current" />
            </>
          )}
        </button>
      </footer>
    </div>
  );
}

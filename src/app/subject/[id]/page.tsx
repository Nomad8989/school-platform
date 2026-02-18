"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Lock,
  Check,
  ArrowLeft,
  Trophy,
  Loader2,
  BrainCircuit,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSubjectData } from "./get-progress"; // 📍 This must match the export in File 1

export default function SubjectPath() {
  const { id } = useParams();
  const [data, setData] = useState<{
    completedUnits: number[];
    mistakeCount: number;
  }>({
    completedUnits: [],
    mistakeCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Fetching the combined progress and mistake data
      const res = await getSubjectData(id as string);
      setData(res);
      setLoading(false);
    }
    load();
  }, [id]);

  const units = [
    { id: 1, title: "Greetings & Basics", type: "normal" },
    { id: 99, title: "Personalized Review", type: "review" },
    { id: 2, title: "Daily Routines", type: "normal" },
    { id: 3, title: "The Past Tense", type: "normal" },
  ];

  // Logic: Check if all "normal" units are finished to show graduation
  const allNormalUnits = units
    .filter((u) => u.type === "normal")
    .map((u) => u.id);
  const isCourseFinished = allNormalUnits.every((uId) =>
    data.completedUnits.includes(uId),
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-indigo-600 font-sans">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      {/* 🔝 Navigation Header */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 px-6 flex items-center justify-between">
        <Link
          href="/"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-black uppercase tracking-widest text-slate-900 italic">
          {id} Path
        </h1>
        <div className="flex items-center gap-2 bg-amber-100 px-4 py-1.5 rounded-2xl border-b-4 border-amber-200">
          <Trophy size={18} className="text-amber-600" />
          <span className="font-black text-amber-700">
            {data.completedUnits.length * 150} XP
          </span>
        </div>
      </nav>

      {/* 🗺️ The Winding Path */}
      <div className="max-w-md mx-auto mt-12 px-6 flex flex-col items-center">
        {units.map((unit, index) => {
          const isCompleted = data.completedUnits.includes(unit.id);
          const hasMistakes = data.mistakeCount > 0;
          const isReview = unit.type === "review";

          // Logic: Unit is locked if it's not a review and the previous unit isn't done
          const isLocked =
            !isReview &&
            index > 0 &&
            !data.completedUnits.includes(units[index - 1].id);
          const isReviewActive = isReview && hasMistakes;

          return (
            <div
              key={unit.id}
              className="flex flex-col items-center relative mb-12 w-full"
            >
              {/* Vertical Connector Line */}
              {index !== units.length - 1 && (
                <div
                  className={`absolute top-20 w-1.5 h-16 rounded-full ${isCompleted ? "bg-green-200" : "bg-slate-100"}`}
                />
              )}

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="relative z-10"
              >
                <Link
                  href={
                    isLocked || (isReview && !hasMistakes)
                      ? "#"
                      : `/activity/${unit.id}`
                  }
                >
                  <button
                    disabled={isLocked || (isReview && !hasMistakes)}
                    className={`w-24 h-24 rounded-4xl flex items-center justify-center border-b-8 transition-all relative
                      ${isReview ? (hasMistakes ? "bg-rose-500 border-rose-700 shadow-xl shadow-rose-200" : "bg-slate-100 border-slate-200 opacity-30 cursor-not-allowed") : ""}
                      ${!isReview && isCompleted ? "bg-green-500 border-green-700" : ""}
                      ${!isReview && !isCompleted && !isLocked ? "bg-amber-400 border-amber-600" : ""}
                      ${isLocked ? "bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed" : "active:border-b-0 active:translate-y-2"}
                    `}
                  >
                    {isReview ? (
                      <BrainCircuit size={40} className="text-white" />
                    ) : isCompleted ? (
                      <Check size={40} className="text-white" />
                    ) : isLocked ? (
                      <Lock size={32} className="text-slate-400" />
                    ) : (
                      <Star size={40} className="text-amber-900 fill-current" />
                    )}
                  </button>
                </Link>
              </motion.div>

              <div className="mt-4 text-center">
                <p
                  className={`text-sm font-black ${isLocked ? "text-slate-200" : "text-slate-600"}`}
                >
                  {unit.title}
                </p>
                {isReview && hasMistakes && (
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter animate-pulse">
                    Needs Review
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* 🎓 GRADUATION ACTION */}
        {isCourseFinished && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-12 w-full"
          >
            <Link href={`/subject/${id}/graduate`} className="no-underline">
              <button className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black text-xl border-b-8 border-blue-800 flex items-center justify-center gap-4 hover:brightness-110 active:border-b-0 active:translate-y-2 transition-all shadow-xl shadow-blue-200">
                <GraduationCap size={32} />
                CLAIM CERTIFICATE
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, ArrowLeft, Loader2, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // 📍 We fetch from the Admin API we already built
        const res = await fetch("/api/admin/stats");
        const data = await res.json();

        if (data.students) {
          // Sort by XP descending
          const sorted = data.students.sort(
            (a: any, b: any) => b.totalXp - a.totalXp,
          );
          setStudents(sorted);
        }
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-indigo-600 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 text-white">
          <Link
            href="/"
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <ArrowLeft />
          </Link>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            Gegee Global Rankings
          </h1>
          <Trophy className="text-amber-400" />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-2">
          {students.length > 0 ? (
            students.map((student, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={student.id}
                className={`flex items-center gap-4 p-6 rounded-[2rem] transition-all ${
                  index === 0 ? "bg-amber-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center font-black text-xl italic text-slate-400">
                  {index === 0 ? (
                    <Crown className="text-amber-500" />
                  ) : index === 1 ? (
                    <Medal className="text-slate-400" />
                  ) : index === 2 ? (
                    <Medal className="text-amber-700" />
                  ) : (
                    `#${index + 1}`
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-mono text-sm font-bold text-slate-500 uppercase">
                    Student {student.id.slice(0, 8)}
                  </p>
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                    {student.unitsCompleted} Lessons Done
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">
                    {student.totalXp}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Total XP
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 font-bold italic">
              No rankings available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Crown, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function LeaderboardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const supabase = createClient();
      // Fetch stats from the API we already built for the Admin
      const res = await fetch("/api/admin/stats");
      const data = await res.json();

      if (data.students) {
        const sorted = data.students.sort(
          (a: any, b: any) => b.totalXp - a.totalXp,
        );
        setStudents(sorted);
      }
      setLoading(false);
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
    <div className="min-h-screen bg-indigo-600 p-4 md:p-8">
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
          {students.map((student, index) => (
            <div
              key={student.id}
              className={`flex items-center gap-4 p-6 rounded-4xl transition-all ${
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

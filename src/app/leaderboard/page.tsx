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
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.students) {
          const sorted = data.students.sort(
            (a: any, b: any) => b.totalXp - a.totalXp,
          );
          setStudents(sorted);
        }
      } catch (error) {
        console.error(error);
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
    <div className="min-h-screen bg-indigo-600 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 text-white">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft />
          </Link>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            Rankings
          </h1>
          <Trophy className="text-amber-400" />
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-2">
          {students.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-6 rounded-[2rem] border-b border-slate-50"
            >
              <div className="w-8 font-black text-slate-400">{index + 1}</div>
              <div className="flex-1 font-bold text-slate-800">
                Student {student.id.slice(0, 5)}
              </div>
              <div className="font-black text-indigo-600">
                {student.totalXp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

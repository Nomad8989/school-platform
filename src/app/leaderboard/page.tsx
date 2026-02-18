"use client";

import { useEffect, useState } from "react";
import { getLeaderboardData } from "@/app/leaderboard/actions"; // 📍 Updated import path
import { Trophy, Medal, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getLeaderboardData();
      setLeaders(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold text-slate-400 animate-pulse">
          RANKING STUDENTS...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* 🔝 Header Section */}
      <div className="bg-[#1a2333] text-white p-8 pt-12 pb-20 rounded-b-4xl text-center relative overflow-hidden">
        <Link
          href="/"
          className="absolute top-8 left-8 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={24} />
        </Link>
        <Trophy className="mx-auto mb-4 text-amber-400" size={48} />
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          School Leaderboard
        </h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">
          Gegee High School • 2026
        </p>
      </div>

      {/* 🏆 Rankings List */}
      <div className="max-w-2xl mx-auto -mt-12 px-6">
        <div className="space-y-4">
          {leaders.length === 0 ? (
            <div className="bg-white p-12 rounded-4xl text-center shadow-lg">
              <p className="text-slate-400 font-bold italic">
                No records yet. Start a lesson to be the first!
              </p>
            </div>
          ) : (
            leaders.map((leader, index) => (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                key={leader.userId}
                className={`flex items-center justify-between p-6 bg-white rounded-4xl shadow-xl shadow-slate-200 border-2 transition-transform hover:scale-[1.02] ${
                  index === 0 ? "border-amber-400" : "border-transparent"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl italic">
                    {index === 0 ? (
                      <Medal className="text-amber-500" size={32} />
                    ) : index === 1 ? (
                      <Medal className="text-slate-400" size={32} />
                    ) : index === 2 ? (
                      <Medal className="text-amber-700" size={32} />
                    ) : (
                      <span className="text-slate-300">#{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg leading-none">
                      Student {leader.userId.slice(0, 5)}
                    </p>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                      Gegee Academy
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-blue-600 leading-none">
                    {leader.totalXp}
                  </p>
                  <p className="text-[10px] font-black text-slate-300 uppercase italic tracking-tighter">
                    Total XP
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

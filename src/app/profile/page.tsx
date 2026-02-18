"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Award, Book, LogOut, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ xp: 0, lessons: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // Fetch user's specific progress
      const { data: progress } = await supabase
        .from("user_progress")
        .select("xp_earned")
        .eq("user_id", user.id);

      const totalXp =
        progress?.reduce((acc, curr) => acc + curr.xp_earned, 0) || 0;
      setStats({ xp: totalXp, lessons: progress?.length || 0 });
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-indigo-600 opacity-10" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-white mb-4 shadow-lg">
              <User size={48} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {user?.email?.split("@")[0].toUpperCase()}
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
              Gegee Student
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl mb-3">
              <Zap size={24} />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.xp}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total XP
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl mb-3">
              <Book size={24} />
            </div>
            <p className="text-2xl font-black text-slate-900">
              {stats.lessons}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Lessons Done
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
            Account Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <span className="text-slate-500 font-bold">Email</span>
              <span className="text-slate-900 font-bold">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <span className="text-slate-500 font-bold">Status</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
                Active Student
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-rose-600 font-black hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}

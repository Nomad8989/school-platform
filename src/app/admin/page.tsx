"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Loader2,
  Lock,
  Sparkles,
  Save,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateAIInstruction, getAIInstruction } from "./settings-action";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    students: [],
    totalXp: 0,
    commonMistakes: [],
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // AI Customization State
  const [aiPrompt, setAiPrompt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkUserAndLoad() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 📍 Strict security for dash@edu.mn
      const adminEmail = "dash@edu.mn";

      if (user?.email === adminEmail) {
        setIsAdmin(true);
        try {
          // 1. Fetch Stats from our Secure API
          const response = await fetch("/api/admin/stats");
          const data = await response.json();
          setStats(data);

          // 2. Fetch Current AI Instructions
          const currentInstruction = await getAIInstruction();
          setAiPrompt(currentInstruction);
        } catch (err) {
          console.error("Failed to load admin data", err);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }
    checkUserAndLoad();
  }, []);

  const handleUpdateAI = async () => {
    setSaving(true);
    const result = await updateAIInstruction(aiPrompt);
    setSaving(false);
    if (result.success) alert("Gegee AI Brain Updated Successfully!");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  if (isAdmin === false)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <Lock size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          Access Denied
        </h1>
        <p className="text-slate-500 font-bold max-w-xs">
          Only Gegee School Administrators can view this dashboard.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* 🔝 Header */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter italic">
            <ShieldCheck className="text-indigo-600" size={32} />
            Gegee Admin
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
            Institutional Oversight
          </p>
        </div>
      </div>

      {/* 📊 Stat Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Users />}
          label="Active Students"
          value={stats.students.length}
          color="bg-blue-600"
        />
        <StatCard
          icon={<BookOpen />}
          label="Total Lessons"
          value={stats.students.reduce(
            (acc: number, s: any) => acc + (s.unitsCompleted || 0),
            0,
          )}
          color="bg-indigo-600"
        />
        <StatCard
          icon={<TrendingUp />}
          label="Total School XP"
          value={stats.totalXp}
          color="bg-emerald-600"
        />
      </div>

      {/* 🧠 AI Teacher Personality Section */}
      <div className="max-w-6xl mx-auto mb-10 bg-white p-8 rounded-4xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">
              AI Teacher Brain
            </h2>
            <p className="text-slate-400 text-sm font-bold">
              Customize the global teaching personality.
            </p>
          </div>
        </div>

        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 focus:border-indigo-500 outline-none transition-all resize-none"
          placeholder="e.g. You are a friendly teacher at Gegee School. Use Mongolian examples..."
        />

        <button
          onClick={handleUpdateAI}
          disabled={saving}
          className="mt-4 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          {saving ? "SAVING..." : "UPDATE TEACHER BRAIN"}
        </button>
      </div>

      {/* ⚠️ Struggles & Graduation Cards */}
      <div className="max-w-6xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top School Struggles */}
        <div className="bg-white p-8 rounded-4xl shadow-xl border border-rose-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Top Struggles
            </h2>
          </div>
          <div className="space-y-4">
            {stats.commonMistakes?.length > 0 ? (
              stats.commonMistakes.map((m: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                >
                  <span className="font-bold text-slate-700 italic">
                    "{m.word_or_phrase}"
                  </span>
                  <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {m.count} Errors
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 font-medium italic">
                No error data recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* Graduation Insights */}
        <div className="bg-indigo-900 p-8 rounded-4xl shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">
              Graduation Status
            </h2>
            <p className="text-indigo-200 font-bold text-sm mb-6 max-w-50">
              {stats.students.filter((s: any) => s.unitsCompleted >= 3).length}{" "}
              students are ready for certification.
            </p>
          </div>
          <button className="relative z-10 w-fit px-6 py-3 bg-white text-indigo-900 font-black rounded-xl hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-lg">
            View Candidates
          </button>
          <GraduationCap
            size={150}
            className="absolute -bottom-6 -right-6 text-white/10 rotate-12"
          />
        </div>
      </div>

      {/* 📋 Progress Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-4xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            Student Progress Logs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="p-6 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em]">
                  Student ID
                </th>
                <th className="p-6 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] text-center">
                  Lessons
                </th>
                <th className="p-6 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] text-center">
                  XP
                </th>
                <th className="p-6 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] text-right">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.students.map((student: any) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors group"
                >
                  <td className="p-6 font-bold text-slate-600 group-hover:text-indigo-600 transition-colors font-mono text-sm uppercase">
                    {student.id.slice(0, 12)}
                  </td>
                  <td className="p-6 text-center font-black text-indigo-600">
                    {student.unitsCompleted}
                  </td>
                  <td className="p-6 text-center font-black text-slate-900">
                    {student.totalXp}
                  </td>
                  <td className="p-6 text-right text-slate-400 text-xs font-bold">
                    {new Date(student.lastActive).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-8 rounded-4xl shadow-lg border border-slate-100 flex items-center gap-6">
      <div className={`${color} p-4 rounded-3xl text-white`}>{icon}</div>
      <div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}

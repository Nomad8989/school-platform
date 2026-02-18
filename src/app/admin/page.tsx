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
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateAIInstruction, getAIInstruction } from "./settings-action";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({ students: [], totalXp: 0 });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [aiPrompt, setAiPrompt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkUserAndLoad() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const adminEmail = "dash@edu.mn";

      if (user?.email === adminEmail) {
        setIsAdmin(true);
        try {
          // Call the API route we created in File 1
          const response = await fetch("/api/admin/stats");
          const data = await response.json();
          setStats(data);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600">
        <Loader2 className="animate-spin" size={40} />
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
    <div className="min-h-screen bg-slate-50 p-8">
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

      {/* 📊 High-Level Stats */}
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
            (acc: any, s: any) => acc + s.unitsCompleted,
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

      {/* 🧠 AI Settings Box */}
      <div className="max-w-6xl mx-auto mb-10 bg-white p-8 rounded-4xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">
              AI Teacher Personality
            </h2>
            <p className="text-slate-400 text-sm font-bold">
              Set the global teaching instructions for all Gemini lessons.
            </p>
          </div>
        </div>

        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 focus:border-indigo-500 outline-none transition-all resize-none"
          placeholder="e.g. Speak like a Mongolian historian and use English..."
        />

        <button
          onClick={handleUpdateAI}
          disabled={saving}
          className="mt-4 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-200"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {saving ? "SAVING..." : "UPDATE TEACHER BRAIN"}
        </button>
      </div>

      {/* 📋 Student Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-4xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white text-slate-800">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            Student Progress Logs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="p-6 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em]">
                  Student Identifier
                </th>
                <th className="p-6 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] text-center">
                  Lessons
                </th>
                <th className="p-6 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] text-center">
                  XP
                </th>
                <th className="p-6 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] text-right">
                  Last Sync
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.students.map((student: any) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors group"
                >
                  <td className="p-6 font-bold text-slate-600 group-hover:text-indigo-600 transition-colors font-mono text-sm">
                    {student.id.slice(0, 12)}...
                  </td>
                  <td className="p-6 text-center font-black text-indigo-600">
                    {student.unitsCompleted}
                  </td>
                  <td className="p-6 text-center font-black text-slate-900">
                    {student.totalXp}
                  </td>
                  <td className="p-6 text-right text-slate-400 text-xs font-bold">
                    {new Date(student.lastActive).toLocaleString()}
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
    <div className="bg-white p-8 rounded-4xl shadow-lg shadow-slate-200/30 border border-slate-100 flex items-center gap-6">
      <div className={`${color} p-4 rounded-3xl text-white shadow-lg`}>
        {icon}
      </div>
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

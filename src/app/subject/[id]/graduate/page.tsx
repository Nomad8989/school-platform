"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  Download,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";

export default function GraduationPage() {
  const params = useParams();
  const subjectId = params?.id as string;
  const [userName, setUserName] = useState<string>("Student");

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        // Simple name derivation from email for the certificate
        const name = data.user.email.split("@")[0];
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    };
    fetchUser();

    // Big Celebration Confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans print:bg-white">
      {/* 🔙 Back Button - Hidden during Print */}
      <Link
        href={`/subject/${subjectId}`}
        className="absolute top-8 left-8 p-3 bg-white rounded-full shadow-md text-slate-400 hover:text-slate-600 transition-all z-50 print:hidden"
      >
        <ArrowLeft size={24} />
      </Link>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full bg-white rounded-4xl shadow-2xl overflow-hidden border-16 border-double border-blue-600 relative"
      >
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="p-16 text-center space-y-8 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Award size={80} className="text-blue-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic">
              Certificate of Completion
            </h1>
            <p className="text-blue-600 font-black tracking-[0.3em] uppercase text-sm">
              Gegee Hybrid School • Mongolia
            </p>
          </div>

          <div className="py-8">
            <p className="text-slate-400 font-medium uppercase tracking-widest mb-4">
              This is to certify that
            </p>
            <h2 className="text-6xl font-serif italic text-slate-800 border-b-2 border-slate-100 pb-4 px-12 inline-block">
              {userName}
            </h2>
          </div>

          <p className="max-w-xl mx-auto text-lg text-slate-600 font-medium leading-relaxed">
            Has successfully demonstrated mastery in the{" "}
            <span className="font-black text-slate-900 uppercase">
              {subjectId}
            </span>{" "}
            curriculum, completing all required units with excellence and
            dedication.
          </p>

          <div className="pt-12 flex items-end justify-between px-12">
            <div className="text-center">
              <div className="w-48 border-b-2 border-slate-200 mb-2"></div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Date of Achievement
              </p>
              <p className="font-bold text-slate-800">
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="relative">
              <GraduationCap
                size={100}
                className="text-blue-600/10 absolute -top-12 -left-4 rotate-12"
              />
              <div className="w-32 h-32 rounded-full border-4 border-blue-600/20 flex items-center justify-center text-blue-600/20 font-black rotate-[-15deg] text-xs text-center p-2 uppercase">
                Official Gegee Seal 2026
              </div>
            </div>

            <div className="text-center">
              <div className="w-48 border-b-2 border-slate-200 mb-2 font-serif text-2xl text-slate-400">
                Dash.Admin
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Authorized School Principal
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🖨️ Controls - Hidden during Print */}
      <div className="mt-12 flex gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl"
        >
          <Download size={20} /> PRINT CERTIFICATE
        </button>
        <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-600 border-2 border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all">
          <Share2 size={20} /> SHARE SUCCESS
        </button>
      </div>
    </div>
  );
}

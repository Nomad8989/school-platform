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
    // 1. Get User Info from Supabase
    const supabase = createClient();
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        // Capitalize the first part of the email for a nice certificate name
        const name = data.user.email.split("@")[0];
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    };
    fetchUser();

    // 2. Continuous Confetti Cannon
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#10b981", "#fbbf24"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#10b981", "#fbbf24"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      {/* Back Button */}
      <Link
        href={`/subject/${subjectId}`}
        className="absolute top-8 left-8 p-3 bg-white rounded-full shadow-md text-slate-400 hover:text-slate-600 transition-all z-50"
      >
        <ArrowLeft size={24} />
      </Link>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white print:shadow-none print:border-0"
      >
        {/* Certificate Header */}
        <div className="bg-blue-600 p-12 text-center text-white relative">
          <GraduationCap
            size={80}
            className="mx-auto mb-6 opacity-20 absolute top-4 right-4 rotate-12"
          />
          <Award size={64} className="mx-auto mb-4 text-amber-300" />
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Certificate of Completion
          </h1>
        </div>

        {/* Certificate Body */}
        <div className="p-12 text-center space-y-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px]">
          <div className="space-y-2">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              This is to certify that
            </p>
            <h2 className="text-5xl font-black text-slate-900 border-b-4 border-slate-100 inline-block px-8 pb-2">
              {userName}
            </h2>
          </div>

          <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
            Has successfully completed the{" "}
            <span className="font-black text-blue-600 uppercase">
              {subjectId || "English"} Mastery Course
            </span>{" "}
            at Gegee Hybrid School.
          </p>

          <div className="pt-8 flex items-center justify-center gap-12 border-t border-slate-100">
            <div className="text-center">
              <p className="font-black text-slate-900 leading-none">Feb 2026</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Issue Date
              </p>
            </div>
            <div className="h-12 w-px bg-slate-100" />
            <div className="text-center italic font-serif text-slate-400">
              <p className="text-xl">Gegee Admin</p>
              <p className="text-[10px] not-italic font-bold uppercase tracking-widest mt-1">
                Authorized By
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons - Hidden when printing */}
      <div className="flex gap-4 mt-12 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:scale-105 transition-all shadow-lg"
        >
          <Download size={20} /> PRINT PDF
        </button>
        <button className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-sm">
          <Share2 size={20} /> SHARE
        </button>
      </div>
    </div>
  );
}

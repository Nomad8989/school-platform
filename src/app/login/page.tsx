"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { Loader2, School, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wrapper to handle the Server Action results
  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const action = isLogin ? login : signup;
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If success, the action redirects automatically
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 🖼️ LEFT SIDE: The Brand */}
      <div className="hidden lg:flex w-1/2 bg-[#1a2333] items-center justify-center relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white/20" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full border-8 border-white/10" />
        </div>

        <div className="text-center relative z-10 text-white p-12">
          <div className="bg-white/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <School size={48} className="text-[#fbbf24]" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            GEGEE SCHOOL
          </h1>
          <p className="text-xl text-slate-300 font-medium max-w-md mx-auto">
            The future of learning in Mongolia. Smart, interactive, and powered
            by AI.
          </p>
        </div>
      </div>

      {/* 📝 RIGHT SIDE: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLogin ? "Welcome back!" : "Create Account"}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin
                ? "Enter your details to access your classroom."
                : "Start your learning journey today."}
            </p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <input
                    name="full_name"
                    required={!isLogin}
                    placeholder="Bat-Erdene"
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-[#fbbf24] focus:ring-4 focus:ring-[#fbbf24]/10 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-slate-400"
                  size={20}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="student@gegee.edu.mn"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-[#fbbf24] focus:ring-4 focus:ring-[#fbbf24]/10 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-400"
                  size={20}
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-[#fbbf24] focus:ring-4 focus:ring-[#fbbf24]/10 transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2 animate-pulse">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-[#1a2333] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2a3649] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#1a2333]/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}{" "}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 font-bold hover:text-[#fbbf24] transition-colors text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

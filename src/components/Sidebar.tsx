"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, User, Home, BookOpen, ShieldCheck } from "lucide-react";

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Map", href: "/", icon: Home },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        );
      })}

      {isAdmin && (
        <Link
          href="/admin"
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-rose-600 hover:bg-rose-50 border-2 border-transparent hover:border-rose-100 transition-all"
        >
          <ShieldCheck size={20} />
          Admin Panel
        </Link>
      )}
    </nav>
  );
}

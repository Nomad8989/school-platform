import {
  Book,
  Calculator,
  Globe,
  FlaskConical,
  Trophy,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const subjects = [
    {
      id: "english",
      name: "English",
      icon: <Book size={32} />,
      color: "bg-amber-400",
      border: "border-amber-600",
      progress: 75,
    },
    {
      id: "math",
      name: "Mathematics",
      icon: <Calculator size={32} />,
      color: "bg-blue-400",
      border: "border-blue-600",
      progress: 10,
    },
    {
      id: "history",
      name: "History",
      icon: <Globe size={32} />,
      color: "bg-red-400",
      border: "border-red-600",
      progress: 0,
    },
    {
      id: "science",
      name: "Science",
      icon: <FlaskConical size={32} />,
      color: "bg-green-400",
      border: "border-green-600",
      progress: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 🟢 Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
          GEGEE
        </h1>
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl font-bold text-slate-900">
            <Book size={20} /> Learn
          </button>
          <button className="flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold">
            <Trophy size={20} /> Leaderboard
          </button>
          <button className="flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold">
            <UserIcon size={20} /> Profile
          </button>
        </nav>
      </aside>

      {/* ⚪ Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            My Classes
          </h2>
          <p className="text-slate-500 font-bold mt-1">
            Grade 12 • 2026 Academic Year
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((sub) => (
            <Link href={`/subject/${sub.id}`} key={sub.id} className="group">
              <div
                className={`${sub.color} ${sub.border} border-b-8 p-8 rounded-[2.5rem] relative overflow-hidden transition-all hover:-translate-y-1 active:translate-y-0`}
              >
                <div className="relative z-10">
                  <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                    {sub.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic">
                    {sub.name}
                  </h3>
                  <div className="mt-8">
                    <div className="flex justify-between text-xs font-black text-black/40 uppercase mb-2">
                      <span>Progress</span>
                      <span>{sub.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 transition-all"
                        style={{ width: `${sub.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

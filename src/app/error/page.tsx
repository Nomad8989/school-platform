export default function ErrorPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-4">Oops!</h1>
      <p className="text-slate-600 mb-8">
        Something went wrong with your login or signup.
      </p>
      <a
        href="/login"
        className="bg-[#1a2333] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
      >
        Try Again
      </a>
    </div>
  );
}

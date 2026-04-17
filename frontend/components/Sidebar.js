export default function Sidebar() {
  return (
    <div className="w-64 bg-black h-screen p-5 text-white border-r border-white/5">
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        HireOrbitAI
      </h1>

      <ul className="space-y-6">
        <li className="flex items-center gap-3 cursor-pointer hover:text-primary transition-all">🏠 Dashboard</li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-primary transition-all">📄 Resume</li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-primary transition-all">💼 Jobs</li>
        <li className="flex items-center gap-3 cursor-pointer hover:text-primary transition-all">📊 Analytics</li>
      </ul>
    </div>
  );
}

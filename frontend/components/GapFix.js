export default function GapFix({ missingSkills }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5">
      <h2 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
        ⚡ Improve your profile
      </h2>

      {missingSkills?.length > 0 && (
        <p className="text-white/60 text-sm mb-3 font-medium">Missing Skills:</p>
      )}

      <div className="space-y-3 mb-6">
        {missingSkills?.length > 0 ? (
          missingSkills.map((skill, i) => (
            <div key={i} className="text-gray-300 flex items-center gap-2 text-sm font-medium">
              <span className="text-red-400">-</span> {skill}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No critical gaps identified!</p>
        )}
      </div>

      {missingSkills?.length > 0 && (
        <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <p className="text-sm text-indigo-300 font-semibold flex items-center gap-2">
            👉 Suggested action:
          </p>
          <p className="text-indigo-200 text-sm mt-1 leading-relaxed">
            "Add 1 project in <span className="font-bold text-white">{missingSkills[0]}</span> to increase match by <span className="font-bold text-green-400">+15%</span>"
          </p>
        </div>
      )}
    </div>
  );
}

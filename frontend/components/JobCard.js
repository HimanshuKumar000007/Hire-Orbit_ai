export default function JobCard({ job }) {
  const getScoreColor = (score) => {
    if (score > 75) return "text-green-400";
    if (score > 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getBadge = (score) => {
    if (score > 75) return "🔥 Strong Match";
    if (score > 50) return "⚡ Growing Match";
    return "🚀 Growth Opportunity";
  };

  return (
    <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition border border-white/5 flex flex-col h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{job.title}</h3>
          <p className="text-gray-400">{job.company}</p>
        </div>
        <div className="text-right whitespace-nowrap ml-4">
          <div className={`text-xl font-bold ${getScoreColor(job.score)}`}>
            {job.score}%
          </div>
          <div className="text-sm text-gray-400 mt-1">{getBadge(job.score)}</div>
        </div>
      </div>

      {(job.matchedSkills?.length > 0 || job.missingSkills?.length > 0) && (
        <div className="mt-4 space-y-2 bg-zinc-950/50 p-4 rounded-xl border border-white/5 grow flex flex-col justify-start">
          {job.matchedSkills?.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5 whitespace-nowrap">✔</span>
              <p className="text-sm text-gray-300">
                <span className="text-white/60 font-medium">Matched:</span> {job.matchedSkills.join(", ")}
              </p>
            </div>
          )}
          {job.missingSkills?.length > 0 && (
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-400 mt-0.5 whitespace-nowrap">❌</span>
                <p>
                  <span className="text-white/60 font-medium">Missing:</span> {job.missingSkills.join(", ")}
                </p>
              </div>
              <div className="mt-1 text-xs bg-indigo-500/10 text-indigo-300 p-3 rounded-lg border border-indigo-500/20">
                <div className="font-semibold flex items-center gap-1 mb-1 text-sm text-indigo-200">
                  🧠 AI Insight:
                </div>
                You are strong in {job.matchedSkills?.[0] || 'core skills'} but lack {job.missingSkills[0]} experience. <br/>
                <span className="text-indigo-200 mt-2 block font-medium">🚀 Suggestion: Build 1 {job.missingSkills[0]} project → increases match by 20%</span>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => window.open(job.redirect_url, "_blank")}
        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-black px-4 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider"
      >
        Apply Now 🚀
      </button>
    </div>
  );
}

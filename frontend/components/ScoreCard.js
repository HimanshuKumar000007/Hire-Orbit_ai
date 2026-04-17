export default function ScoreCard({ score }) {
  const getScoreColor = (score) => {
    if (score > 75) return "bg-green-400";
    if (score > 50) return "bg-yellow-400";
    return "bg-red-400";
  };
  
  const getTextColor = (score) => {
    if (score > 75) return "text-green-400";
    if (score > 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-white/5">
      <h2 className="text-xl font-semibold text-white">Your Match Score (Best Job)</h2>
      <p className={`text-4xl font-bold ${getTextColor(score)} mt-2`}>{score}%</p>

      <div className="w-full bg-zinc-700 h-3 rounded-full mt-4 overflow-hidden">
        <div
          className={`${getScoreColor(score)} h-3 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

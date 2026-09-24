import { QuickFactItem } from "@/lib/universal-notice-model";
import { 
  Award, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2,
  FileCheck,
  TrendingUp,
  FileText
} from 'lucide-react';

interface ResultQuickFactsProps {
  facts: QuickFactItem[];
}

export function ResultQuickFacts({ facts }: ResultQuickFactsProps) {
  if (!facts || facts.length === 0) return null;

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('qualif') || l.includes('candidate')) return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (l.includes('stage')) return <Award className="w-4 h-4 text-emerald-400" />;
    if (l.includes('post') || l.includes('vacanc')) return <GraduationCap className="w-4 h-4 text-blue-400" />;
    if (l.includes('result date')) return <Calendar className="w-4 h-4 text-emerald-400" />;
    if (l.includes('exam date')) return <Clock className="w-4 h-4 text-purple-400" />;
    if (l.includes('authority') || l.includes('org') || l.includes('board')) return <Building2 className="w-4 h-4 text-zinc-400" />;
    if (l.includes('next')) return <TrendingUp className="w-4 h-4 text-amber-400" />;
    return <FileCheck className="w-4 h-4 text-zinc-400" />;
  };

  return (
    <div className="rounded-2xl glass p-5 sm:p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Quick Result Overview & Key Metrics
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {facts.map((fact, idx) => (
          <div 
            key={idx}
            className={`p-3.5 rounded-xl border transition-all ${
              fact.highlight
                ? 'bg-emerald-500/[0.04] border-emerald-500/20 shadow-glow-sm'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1.5 font-medium">
              {getIcon(fact.label)}
              <span className="truncate">{fact.label}</span>
            </div>
            <div className={`font-bold text-sm sm:text-base truncate ${
              fact.highlight ? 'text-emerald-400' : 'text-white'
            }`} title={fact.value}>
              {fact.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

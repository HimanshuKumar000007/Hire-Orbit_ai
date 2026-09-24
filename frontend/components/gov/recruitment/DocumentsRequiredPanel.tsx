import { FileCheck, CheckCircle2 } from 'lucide-react';

interface DocumentsRequiredPanelProps {
  documents: string[];
}

export function DocumentsRequiredPanel({ documents }: DocumentsRequiredPanelProps) {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Documents Required for Online Application
            </h2>
            <p className="text-xs text-zinc-400">
              Keep these original certificates and scanned copies ready before starting registration
            </p>
          </div>
        </div>

        <span className="text-xs text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
          {documents.length} Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300">
        {documents.map((doc, idx) => (
          <div 
            key={idx}
            className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3 hover:border-white/10 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{doc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

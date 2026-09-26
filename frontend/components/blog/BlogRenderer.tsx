"use client";

import React, { useState } from "react";
import { Check, Copy, Sparkles, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

interface BlogRendererProps {
  content: string;
}

export function BlogRenderer({ content }: BlogRendererProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Helper to render markdown inline elements (bold, code, links, math)
  const renderInline = (text: string): React.ReactNode => {
    // Regex for bold, inline code, and links
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    // Split and parse inline tokens
    const inlineRegex = /(\*\*.*?\*\*|\`[^\`]+\`|\[.*?\]\(.*?\)|\$\\text\{.*?\}\$)/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={key++} className="font-bold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={key++}
            className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-mono text-[11px] sm:text-xs border border-white/10 break-all"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("[") && token.includes("](")) {
        const linkText = token.slice(1, token.indexOf("]("));
        const linkHref = token.slice(token.indexOf("](") + 2, -1);
        parts.push(
          <a
            key={key++}
            href={linkHref}
            target={linkHref.startsWith("http") ? "_blank" : undefined}
            rel={linkHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-400 transition-colors break-words"
          >
            {linkText}
          </a>
        );
      } else if (token.startsWith("$") && token.endsWith("$")) {
        // Clean display of inline math
        const formula = token.slice(1, -1).replace(/\\text\{/g, "").replace(/\}/g, "");
        parts.push(
          <span
            key={key++}
            className="inline-block px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-xs sm:text-sm border border-emerald-500/20 max-w-full overflow-x-auto align-middle"
          >
            {formula}
          </span>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Split lines and parse blocks
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check for Code Block (```lang ... ```)
    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      const codeString = codeLines.join("\n");
      const blockId = `code-block-${i}`;

      elements.push(
        <div
          key={`code-${i}`}
          className="my-5 sm:my-6 rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900/95 overflow-hidden shadow-2xl backdrop-blur-md max-w-full"
        >
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 border-b border-white/10 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider text-emerald-400 font-semibold text-[11px] sm:text-xs truncate">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              {language || "code"}
            </span>
            <button
              onClick={() => copyCode(codeString, blockId)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-xs font-medium shrink-0"
              aria-label="Copy code to clipboard"
            >
              {copiedCodeId === blockId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px] sm:text-xs">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px] sm:text-xs">Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3.5 sm:p-5 text-xs sm:text-sm font-mono text-zinc-200 overflow-x-auto leading-relaxed max-w-full">
            <code className="block">{codeString}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Check for Table (| Header | Header |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);

        const rowLines = tableLines.slice(2); // skip header separator line

        elements.push(
          <div key={`table-${i}`} className="my-6 sm:my-8 rounded-xl sm:rounded-2xl border border-white/10 glass-strong overflow-hidden max-w-full">
            {/* Mobile horizontal scroll indicator */}
            <div className="flex sm:hidden items-center justify-between px-3.5 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Scroll table horizontally
              </span>
              <span className="text-[10px] text-emerald-300 font-mono tracking-wider">Swipe ➔</span>
            </div>
            <div className="overflow-x-auto max-w-full -webkit-overflow-scrolling-touch">
              <table className="min-w-[540px] w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {headerCells.map((header, idx) => (
                      <th key={idx} className="py-3 px-3.5 sm:py-3.5 sm:px-4 font-semibold text-emerald-400 uppercase tracking-wider text-[11px] sm:text-xs whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rowLines.map((r, rIdx) => {
                    const cells = r
                      .split("|")
                      .map((c) => c.trim())
                      .filter(Boolean);
                    return (
                      <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                        {cells.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3.5 sm:py-3.5 sm:px-4 text-zinc-300 leading-relaxed break-words">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      continue;
    }

    // Check for Math Display Block ($$...$$)
    if (line.trim().startsWith("$$") && line.trim().endsWith("$$")) {
      const formula = line.trim().slice(2, -2).replace(/\\text\{/g, "").replace(/\}/g, "").replace(/\\cdot/g, "·").replace(/\\times/g, "×");
      elements.push(
        <div
          key={`math-${i}`}
          className="my-5 sm:my-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center text-emerald-300 font-mono text-xs sm:text-sm md:text-base overflow-x-auto max-w-full"
        >
          {formula}
        </div>
      );
      i++;
      continue;
    }

    // Check for Heading 2 (## Heading {#id})
    if (line.startsWith("## ")) {
      let title = line.slice(3).trim();
      let anchorId = "";
      const anchorMatch = title.match(/\{#(.*?)\}/);
      if (anchorMatch) {
        anchorId = anchorMatch[1];
        title = title.replace(/\{#(.*?)\}/, "").trim();
      } else {
        anchorId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      }

      elements.push(
        <h2
          key={`h2-${i}`}
          id={anchorId}
          className="scroll-mt-24 text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-9 sm:mt-14 mb-3.5 sm:mb-5 flex items-start gap-2.5 sm:gap-3 group"
        >
          <span className="w-1.5 h-6 rounded-full bg-emerald-500 inline-block shrink-0 mt-1" />
          <span className="break-words min-w-0 flex-1">{title}</span>
          <a
            href={`#${anchorId}`}
            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-emerald-400 text-sm sm:text-base transition-opacity ml-1 shrink-0 mt-1"
            aria-label="Link to section"
          >
            #
          </a>
        </h2>
      );
      i++;
      continue;
    }

    // Check for Heading 3 (### Heading)
    if (line.startsWith("### ")) {
      const title = line.slice(4).trim();
      const anchorId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      elements.push(
        <h3
          key={`h3-${i}`}
          id={anchorId}
          className="scroll-mt-24 text-lg sm:text-xl lg:text-2xl font-semibold text-zinc-100 mt-6 sm:mt-8 mb-2.5 sm:mb-3.5 break-words"
        >
          {title}
        </h3>
      );
      i++;
      continue;
    }

    // Check for Blockquote (> ...)
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s*/, ""));
        i++;
      }
      const fullQuote = quoteLines.join(" ");
      const isKeyTakeaway = fullQuote.toLowerCase().includes("key takeaway") || fullQuote.toLowerCase().includes("pro tip");

      elements.push(
        <div
          key={`quote-${i}`}
          className={`my-5 sm:my-6 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border flex items-start gap-3 sm:gap-4 ${
            isKeyTakeaway
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              : "bg-white/5 border-white/10 text-zinc-300"
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {isKeyTakeaway ? (
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
            )}
          </div>
          <div className="text-xs sm:text-sm leading-relaxed break-words flex-1 min-w-0">{renderInline(fullQuote)}</div>
        </div>
      );
      continue;
    }

    // Check for Checklist (- [ ] or - [x])
    if (line.trim().startsWith("- [ ]") || line.trim().startsWith("- [x]")) {
      const isChecked = line.trim().startsWith("- [x]");
      const itemText = line.trim().replace(/- \[[ x]\]\s*/, "");
      elements.push(
        <div key={`check-${i}`} className="flex items-start gap-2.5 sm:gap-3 my-2 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed break-words">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">{renderInline(itemText)}</div>
        </div>
      );
      i++;
      continue;
    }

    // Check for Unordered List Item (* ... or - ...)
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      const itemText = line.trim().slice(2);
      elements.push(
        <li key={`li-${i}`} className="ml-4 sm:ml-5 list-disc text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed my-1.5 pl-1 break-words marker:text-emerald-400">
          {renderInline(itemText)}
        </li>
      );
      i++;
      continue;
    }

    // Check for Ordered List Item (1. ...)
    if (/^\d+\.\s/.test(line.trim())) {
      const match = line.trim().match(/^(\d+)\.\s(.*)/);
      if (match) {
        const number = match[1];
        const itemText = match[2];
        elements.push(
          <div key={`oli-${i}`} className="flex items-start gap-2.5 sm:gap-3 my-2 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed break-words">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 text-emerald-400 text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {number}
            </span>
            <div className="flex-1 min-w-0">{renderInline(itemText)}</div>
          </div>
        );
      }
      i++;
      continue;
    }

    // Horizontal Rule (---)
    if (line.trim() === "---") {
      elements.push(<hr key={`hr-${i}`} className="my-8 sm:my-10 border-white/10" />);
      i++;
      continue;
    }

    // Standard Paragraph
    if (line.trim() !== "") {
      elements.push(
        <p key={`p-${i}`} className="text-zinc-300 text-[15px] sm:text-base md:text-lg leading-relaxed my-3.5 sm:my-4 break-words">
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return <div className="blog-content space-y-1.5 sm:space-y-2 max-w-full overflow-hidden break-words">{elements}</div>;
}

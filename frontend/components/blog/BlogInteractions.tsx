"use client";

import React, { useState, useEffect } from "react";
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Link as LinkIcon, 
  Check, 
  ChevronDown, 
  ListOrdered,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { TableOfContentItem, FAQItem } from "@/lib/blog-data";

interface BlogInteractionsProps {
  slug: string;
  title: string;
  tableOfContents: TableOfContentItem[];
  faq?: FAQItem[];
}

// 1. Fixed Top Reading Progress Bar
export function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// 2. Share Buttons Component
export function ShareArticleButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const postUrl = typeof window !== "undefined" ? window.location.href : `https://hireorbitai.in/blog/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(postUrl)}&via=hireorbitai`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2 sm:gap-2.5">
      <button
        onClick={handleShareTwitter}
        aria-label="Share on X (Twitter)"
        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all text-xs font-medium active:scale-95"
      >
        <Twitter className="w-3.5 h-3.5" />
        <span>Post</span>
      </button>
      <button
        onClick={handleShareLinkedin}
        aria-label="Share on LinkedIn"
        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all text-xs font-medium active:scale-95"
      >
        <Linkedin className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>
      <button
        onClick={handleCopyLink}
        aria-label="Copy Article Link"
        className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all active:scale-95 shrink-0"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}

// 3. Mobile Collapsible Table of Contents (Inline above article content)
export function MobileTableOfContents({
  tableOfContents,
}: {
  tableOfContents: TableOfContentItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headings = tableOfContents.map((item) => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 180;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveId(tableOfContents[i].id);
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  if (!tableOfContents || tableOfContents.length === 0) return null;

  return (
    <div className="lg:hidden mb-8 rounded-2xl border border-white/10 glass-strong overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-white/[0.02] hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <BookOpen className="w-4 h-4" />
          <span>Table of Contents ({tableOfContents.length} Sections)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span>{isOpen ? "Hide" : "Jump to section"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-400" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <nav className="p-4 pt-1 space-y-1.5 border-t border-white/5 max-h-[60vh] overflow-y-auto">
          {tableOfContents.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    setActiveId(item.id);
                    setIsOpen(false);
                  }
                }}
                className={`flex items-start gap-2.5 py-2 px-3 rounded-xl text-xs sm:text-sm leading-relaxed transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/5 text-zinc-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1 break-words">{item.title}</span>
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}

// 4. Desktop Sidebar Table of Contents & Share Container
export function DesktopSidebar({
  slug,
  title,
  tableOfContents,
}: {
  slug: string;
  title: string;
  tableOfContents: TableOfContentItem[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headings = tableOfContents.map((item) => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 180;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveId(tableOfContents[i].id);
          return;
        }
      }

      if (headings.length > 0 && headings[0]) {
        setActiveId(tableOfContents[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  return (
    <aside className="space-y-6">
      {/* Table of Contents Card */}
      {tableOfContents.length > 0 && (
        <div className="glass-strong rounded-3xl border border-white/10 p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
            <ListOrdered className="w-4 h-4" />
            Table of Contents
          </div>
          <nav className="space-y-1.5 text-xs sm:text-sm">
            {tableOfContents.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(item.id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                      setActiveId(item.id);
                    }
                  }}
                  className={`block py-1.5 px-3 rounded-xl transition-all leading-snug break-words ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 pl-3.5"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {item.title}
                </a>
              );
            })}
          </nav>
        </div>
      )}

      {/* Share This Article Card */}
      <div className="glass-strong rounded-3xl border border-white/10 p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
          <Share2 className="w-4 h-4 text-emerald-400" />
          Share Article
        </div>
        <ShareArticleButtons slug={slug} title={title} />
      </div>
    </aside>
  );
}

// 5. Frequently Asked Questions Section (Placed full-width in main column)
export function BlogFaqSection({ faq }: { faq: FAQItem[] }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!faq || faq.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-6 rounded-full bg-emerald-500 inline-block shrink-0" />
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
          Frequently Asked Questions
        </h3>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {faq.map((item, idx) => {
          const isOpen = openFaqIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl sm:rounded-2xl border border-white/10 glass-strong overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-white hover:text-emerald-400 transition-colors font-semibold text-sm sm:text-base gap-3"
              >
                <span className="break-words leading-snug">{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-400" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed border-t border-white/5 break-words">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 6. Backwards compatible BlogInteractions default component
export function BlogInteractions({ slug, title, tableOfContents, faq = [] }: BlogInteractionsProps) {
  return (
    <>
      <ReadingProgressBar />
      <DesktopSidebar slug={slug} title={title} tableOfContents={tableOfContents} />
      {faq && faq.length > 0 && <BlogFaqSection faq={faq} />}
    </>
  );
}

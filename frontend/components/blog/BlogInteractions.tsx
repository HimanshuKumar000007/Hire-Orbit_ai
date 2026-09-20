"use client";

import React, { useState, useEffect } from "react";
import { Share2, Twitter, Linkedin, Link as LinkIcon, Check, ChevronDown, ListOrdered } from "lucide-react";
import { toast } from "sonner";
import { TableOfContentItem, FAQItem } from "@/lib/blog-data";

interface BlogInteractionsProps {
  slug: string;
  title: string;
  tableOfContents: TableOfContentItem[];
  faq: FAQItem[];
}

export function BlogInteractions({ slug, title, tableOfContents, faq }: BlogInteractionsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll for TOC highlighting and Reading Progress
  useEffect(() => {
    const handleScroll = () => {
      // Progress Bar calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // TOC active state calculation
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
    <>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Table of Contents & Share Container */}
      <aside className="space-y-6">
        {/* Table of Contents Card */}
        {tableOfContents.length > 0 && (
          <div className="glass-strong rounded-3xl border border-white/10 p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
              <ListOrdered className="w-4 h-4" />
              Table of Contents
            </div>
            <nav className="space-y-2 text-sm">
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
                    className={`block py-1.5 px-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 pl-4"
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
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShareTwitter}
              aria-label="Share on X (Twitter)"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all text-xs font-medium"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
            <button
              onClick={handleShareLinkedin}
              aria-label="Share on LinkedIn"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all text-xs font-medium"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleCopyLink}
              aria-label="Copy Article Link"
              className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Frequently Asked Questions Section (rendered at the bottom of the article) */}
      {faq.length > 0 && (
        <section className="mt-16 pt-12 border-t border-white/10">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-emerald-500 inline-block" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faq.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 glass-strong overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-white hover:text-emerald-400 transition-colors font-medium text-base sm:text-lg"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/5">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

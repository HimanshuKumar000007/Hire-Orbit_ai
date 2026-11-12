"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  ArrowUpRight,
  User,
  FileCheck2,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from "lucide-react";
import { getFeaturedHomepagePosts, BlogPost } from "@/lib/blog-data";

const categoryStyles: Record<string, { badge: string; icon: typeof FileCheck2 }> = {
  "Resume & ATS": {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: FileCheck2,
  },
  "AI & Tech": {
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    icon: BrainCircuit,
  },
  "Interview Prep": {
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    icon: MessageSquare,
  },
  "Career Growth": {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: TrendingUp,
  },
};

export function FeaturedArticles() {
  const posts = getFeaturedHomepagePosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured Career & AI Hiring Guides",
    "description": "In-depth blueprints, ATS resume optimization rules, and interview strategies from HireOrbitAI.",
    "itemListElement": posts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.metaDescription,
        "url": `https://hireorbitai.in/blog/${post.slug}`,
        "datePublished": post.publishedAt,
        "author": {
          "@type": "Person",
          "name": post.author.name,
        },
      },
    })),
  };

  return (
    <section 
      id="featured-guides" 
      aria-labelledby="featured-guides-heading" 
      className="relative py-20 sm:py-28 bg-zinc-950 border-t border-white/5 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />
      </div>

      {/* JSON-LD for Search Engines & Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Research &amp; Career Intelligence</span>
          </motion.div>

          <motion.h2
            id="featured-guides-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
          >
            In-Depth Career &amp;{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Hiring Blueprints
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 leading-relaxed"
          >
            Actionable strategies, reverse-engineered ATS formatting rules, and modern job search playbooks designed to help ambitious professionals stand out.
          </motion.p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post, idx) => {
            const style = categoryStyles[post.category] || categoryStyles["Career Growth"];
            const CategoryIcon = style.icon;

            return (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-emerald-500/30 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-1"
              >
                {/* Header details */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span 
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${style.badge}`}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {post.category}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-zinc-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-3">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
                      HK
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">
                        {post.author.name}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors group-hover:translate-x-0.5 duration-200"
                    aria-label={`Read ${post.title}`}
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* View All Guides CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-emerald-500/40 text-white font-semibold text-sm hover:bg-zinc-800/80 transition-all shadow-md group"
          >
            <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Explore All 40+ Career &amp; Tech Guides</span>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

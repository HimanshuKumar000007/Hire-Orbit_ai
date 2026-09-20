import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  Bookmark,
  Share2
} from "lucide-react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  getPostBySlug, 
  getPublishedPosts, 
  getRelatedPosts, 
  getAllPosts,
  BlogPost 
} from "@/lib/blog-data";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { BlogInteractions } from "@/components/blog/BlogInteractions";

// Next.js ISR: revalidate every hour so scheduled posts go live automatically
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const post = getPostBySlug(slug, preview === "true");

  if (!post) {
    return {
      title: "Article Not Found | HireOrbitAi Blog",
      description: "The requested article could not be found or has not yet been published.",
    };
  }

  const siteUrl = process.env.SITE_URL || "https://hireorbitai.in";
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | HireOrbitAi`,
    description: post.metaDescription,
    keywords: post.seoKeywords,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: canonicalUrl,
      siteName: "HireOrbitAi",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      creator: "@hireorbitai",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";
  const post = getPostBySlug(slug, isPreview);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);
  const siteUrl = process.env.SITE_URL || "https://hireorbitai.in";
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  // Schema.org Structured Data
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    keywords: post.seoKeywords.join(", "),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "HireOrbitAi",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const jsonLdFaq =
    post.faq && post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30 text-zinc-100">
      <Navigation />

      {/* Structured Data Scripts for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}

      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-center text-xs font-medium tracking-wide">
          ⚡ <strong>Preview Mode Active:</strong> Viewing scheduled article before public release.
        </div>
      )}

      {/* Hero / Article Header Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8" aria-label="Breadcrumbs">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-zinc-300 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-400 font-medium">{post.category}</span>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{formattedDate}</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-8 max-w-4xl">
            {post.title}
          </h1>

          {/* Excerpt Lead */}
          <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed max-w-3xl mb-8 font-light">
            {post.excerpt}
          </p>

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-6 border-t border-white/10 max-w-3xl">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-black text-sm shadow-lg shadow-emerald-500/20">
              {post.author.name[0]}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{post.author.name}</div>
              <div className="text-xs text-zinc-400">{post.author.role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout with Sticky Sidebar */}
      <section className="pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Article Column (8 cols) */}
            <article className="lg:col-span-8 min-w-0">
              {/* Blog Content Renderer */}
              <BlogRenderer content={post.content} />

              {/* Contextual HireOrbit Conversion CTA Card */}
              {post.cta && (
                <div className="my-16 rounded-[2.5rem] p-8 sm:p-12 glass-strong border border-emerald-500/30 relative overflow-hidden shadow-2xl">
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      HireOrbitAi Power Feature
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
                      {post.cta.headline}
                    </h3>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8">
                      {post.cta.subheadline}
                    </p>
                    <Link
                      href={post.cta.buttonLink}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all hover:scale-105 shadow-lg shadow-emerald-500/25"
                    >
                      <span>{post.cta.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Author Bio Box */}
              <div className="p-8 rounded-3xl glass-strong border border-white/10 mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-black text-xl shrink-0 shadow-lg shadow-emerald-500/20">
                  {post.author.name[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Written by {post.author.name}</h4>
                  <p className="text-xs text-emerald-400 mb-2">{post.author.role}</p>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Building next-generation AI agents and semantic career intelligence platforms. Helping engineers and leaders bridge the gap between technical capability and dream job offers.
                  </p>
                </div>
              </div>

              {/* Article Tags */}
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mr-2">
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <BlogInteractions
                  slug={post.slug}
                  title={post.title}
                  tableOfContents={post.tableOfContents}
                  faq={post.faq}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="py-20 border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Related Articles
              </h3>
              <Link
                href="/blog"
                className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group rounded-3xl border border-white/5 hover:border-white/20 glass-strong p-6 flex flex-col justify-between transition-all hover:-translate-y-1"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {rel.category}
                    </span>
                    <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mt-4 mb-2 leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5 text-xs text-zinc-500 mt-6">
                    <span>{rel.readTime}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Mail, 
  Github, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Rocket, 
  Award,
  BookOpen,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Himanshu Kumar - CEO & Founder | HireOrbitAI",
  description: "Learn about Himanshu Kumar, CEO & Founder of HireOrbitAI. B.Com (Hons) graduate from Banaras Hindu University (BHU), pioneering AI-powered career intelligence from Mirzapur, Uttar Pradesh (231305).",
  keywords: [
    "Himanshu Kumar",
    "Himanshu Kumar HireOrbitAI",
    "Himanshu Kumar CEO",
    "Founder HireOrbitAI",
    "Himanshu Kumar Banaras Hindu University",
    "Himanshu Kumar BHU",
    "Himanshu Kumar Mirzapur",
    "HireOrbitAI founder"
  ],
  openGraph: {
    title: "Himanshu Kumar - CEO & Founder | HireOrbitAI",
    description: "Official profile of Himanshu Kumar, CEO and Founder of HireOrbitAI. Banaras Hindu University alumnus spearheading human-centric AI career navigation.",
    url: "https://hireorbitai.in/founder",
    siteName: "HireOrbitAI",
    type: "profile",
  },
  alternates: {
    canonical: "https://hireorbitai.in/founder",
  },
};

export default function FounderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Himanshu Kumar",
    "jobTitle": "CEO and Founder",
    "worksFor": {
      "@type": "Organization",
      "name": "HireOrbitAI",
      "url": "https://hireorbitai.in"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Banaras Hindu University",
      "sameAs": "https://www.bhu.ac.in"
    },
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree",
      "name": "Bachelor of Commerce (Honours) - B.Com (Hons)"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mirzapur",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "231305",
      "addressCountry": "IN"
    },
    "url": "https://hireorbitai.in/founder",
    "sameAs": [
      "https://github.com/HimanshuKumar000007",
      "https://hireorbitai.in"
    ]
  };

  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30 text-zinc-100">
      {/* Schema.org Person Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[650px] h-[650px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Founder Avatar & Key Card */}
            <div className="w-full max-w-md shrink-0">
              <div className="relative glass-strong rounded-[2.5rem] p-8 border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 p-[2px] shadow-glow">
                      <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center overflow-hidden">
                        <Users className="w-16 h-16 text-emerald-400" />
                      </div>
                    </div>
                    <span className="absolute -bottom-2.5 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                      Founder
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-white tracking-tight">Himanshu Kumar</h1>
                  <p className="text-emerald-400 font-semibold text-base mt-1">CEO & Founder, HireOrbitAI</p>

                  <div className="w-full mt-6 pt-6 border-t border-white/5 space-y-3 text-left text-sm">
                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-medium">B.Com (Hons), Banaras Hindu University</span>
                    </div>

                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-medium">Mirzapur, Uttar Pradesh - 231305, India</span>
                    </div>

                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-medium">Executive Leadership & AI Vision</span>
                    </div>
                  </div>

                  {/* Connect quick links */}
                  <div className="w-full mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-4">
                    <a 
                      href="mailto:hireorbitai@gmail.com"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-zinc-300 hover:text-emerald-400 transition-colors border border-white/5"
                      aria-label="Email Himanshu Kumar"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://github.com/HimanshuKumar000007" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-zinc-300 hover:text-emerald-400 transition-colors border border-white/5"
                      aria-label="GitHub Profile"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Text & Narrative */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Founder & Executive Leadership
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Democratizing Career Success with <span className="gradient-text">Human-Centric AI</span>
              </h2>

              <p className="text-lg text-zinc-300 leading-relaxed">
                As the CEO and Founder of HireOrbitAI, <strong className="text-white">Himanshu Kumar</strong> leads 
                the architectural vision and strategic development of next-generation AI solutions for job seekers and hiring teams.
              </p>

              <blockquote className="border-l-2 border-emerald-500/80 pl-5 py-2 my-4 text-zinc-300 italic text-base bg-emerald-500/[0.03] rounded-r-xl">
                &ldquo;Legacy hiring boards and archaic ATS filters have locked millions of deserving candidates behind black-box keyword matching. 
                We created HireOrbitAI to democratize career navigation, making top-tier resume analysis, live AI prep, and smart matching accessible to every candidate globally.&rdquo;
              </blockquote>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/about"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all border border-white/10 text-sm flex items-center gap-2"
                >
                  About HireOrbitAI
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all text-sm flex items-center gap-2 shadow-glow-sm"
                >
                  Experience the Platform
                  <Rocket className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Credentials & Background */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Credentials & Heritage</h2>
            <p className="text-zinc-400 text-sm">
              Combining commercial acumen from India&apos;s premier educational institution with technical ambition to reshape career opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* BHU Card */}
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-1">Academic Alma Mater</div>
              <h3 className="text-xl font-bold text-white mb-2">Banaras Hindu University</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Earned a <strong className="text-zinc-200">Bachelor of Commerce (Honours)</strong> from BHU, one of India&apos;s most prestigious central universities, establishing a strong foundation in market economics, business analytics, and scalable commerce.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> B.Com (Hons) Alumnus
              </div>
            </div>

            {/* Location & Roots Card */}
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-teal-400" />
              </div>
              <div className="text-xs uppercase tracking-wider text-teal-400 font-bold mb-1">Hometown & Office Base</div>
              <h3 className="text-xl font-bold text-white mb-2">Mirzapur, Uttar Pradesh</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Proudly rooted in <strong className="text-zinc-200">Mirzapur - 231305, Uttar Pradesh</strong>. Spearheading India&apos;s digital revolution from Tier-2 regions to show that groundbreaking technology can be built from anywhere.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Postal Code: 231305
              </div>
            </div>

            {/* Innovation Card */}
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-1">Product Leadership</div>
              <h3 className="text-xl font-bold text-white mb-2">HireOrbitAI Ecosystem</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Architect of HireOrbitAI&apos;s intelligent modules: real-time ATS resume scoring, AI interview copilots, role tailoring, and automated job matching algorithms.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> CEO & Lead Architect
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Journey Narrative */}
      <section className="py-20 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" /> Founder&apos;s Perspective
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Why Himanshu Founded HireOrbitAI
              </h2>
            </div>

            <div className="space-y-6 text-zinc-300 leading-relaxed text-base">
              <p>
                During his time studying commerce and business fundamentals at <strong>Banaras Hindu University</strong>, Himanshu Kumar noticed a glaring disparity: while top-tier metropolitan candidates had access to expensive career coaches, proprietary networks, and specialized tools, thousands of equally brilliant candidates across India were getting rejected by robotic ATS filters.
              </p>

              <p>
                Traditional platforms like LinkedIn have become crowded social feeds rather than focused job engines. Applicants spend dozens of hours sending applications into a void without actionable feedback on why their resume was rejected or how they could improve.
              </p>

              <p>
                Recognizing the transformative potential of modern Large Language Models and semantic search, Himanshu set out to build <strong>HireOrbitAI</strong>. Operating from <strong>Mirzapur (231305, UP)</strong>, the goal was clear: provide every applicant with a 24/7 personal career co-pilot that can parse resumes with surgical accuracy, optimize bullet points for ATS compliance, and train them through simulated technical and behavioral interviews.
              </p>
            </div>

            {/* Core Values / Philosophy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-white font-bold">Uncompromising Quality</h4>
                </div>
                <p className="text-xs text-zinc-400">
                  Every feature is engineered for high accuracy, low latency, and tangible interview callback rate improvements.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-white font-bold">Accessible To All</h4>
                </div>
                <p className="text-xs text-zinc-400">
                  Career acceleration tools shouldn&apos;t be a luxury. Empowering job seekers from every tier, city, and background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect & Contact Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
            
            <h2 className="text-3xl font-bold text-white mb-4">Connect with the Founder</h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-8">
              Open to strategic partnerships, recruitment collaborations, investor relations, and candidate feedback.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:hireorbitai@gmail.com"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm inline-flex items-center gap-2 transition-all shadow-glow-sm"
              >
                <Mail className="w-4 h-4" />
                Email Himanshu
              </a>

              <a
                href="https://github.com/HimanshuKumar000007"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm inline-flex items-center gap-2 transition-all border border-white/10"
              >
                <Github className="w-4 h-4" />
                GitHub: HimanshuKumar000007
              </a>

              <Link
                href="/about"
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-medium text-sm inline-flex items-center gap-2 transition-all border border-white/5"
              >
                About HireOrbitAI
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 text-xs text-zinc-500 flex flex-wrap items-center justify-center gap-4">
              <span>Executive Office: Mirzapur, Uttar Pradesh - 231305</span>
              <span>•</span>
              <span>Official Inquiries: hireorbitai@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

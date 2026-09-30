import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { MixpanelInitializer } from "@/components/analytics/MixpanelInitializer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "HireOrbitAi | AI-Powered Resume Analysis",
  description: "Upload your resume and let AI extract your skills, experience, and ideal roles in seconds.",
  other: {
    "google-adsense-account": "ca-pub-7428853562205065",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export default function RootLayout({ children }) {
  const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-82W7CWTG5N";
  const gaId = rawGaId.startsWith("G-") ? rawGaId : `G-${rawGaId}`;
  const siteUrl = process.env.SITE_URL || "https://hireorbitai.in";

  const rootJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "HireOrbitAi",
        alternateName: "HireOrbit AI",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/favicon.ico`,
          caption: "HireOrbitAi",
        },
        sameAs: [
          "https://twitter.com/hireorbitai",
          "https://linkedin.com/company/hireorbitai",
          "https://github.com/HimanshuKumar000007",
        ],
        description:
          "AI-powered career intelligence platform providing semantic resume analysis, ATS scoring, and automated job matching.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "HireOrbitAi",
        description: "AI-Powered Resume Analysis & Job Discovery Engine",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: "HireOrbitAi Career Copilot",
        operatingSystem: "All",
        applicationCategory: "BusinessApplication",
        url: siteUrl,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${outfit.variable} dark antialiased`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7428853562205065" />
        <script
          async={true}
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7428853562205065"
          crossOrigin="anonymous"
        />
        {/* Global JSON-LD Schema (Organization, WebSite, SoftwareApplication) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        {/* Google tag (gtag.js) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen overflow-x-hidden">
        <MixpanelInitializer />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_transparent_50%)] opacity-20 pointer-events-none" />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

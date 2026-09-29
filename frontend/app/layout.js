import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";

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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-82W7CWTG5N";

  return (
    <html lang="en" className={`${outfit.variable} dark antialiased`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7428853562205065" />
        <script
          async={true}
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7428853562205065"
          crossOrigin="anonymous"
        />
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-background text-foreground min-h-screen overflow-x-hidden">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_transparent_50%)] opacity-20 pointer-events-none" />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

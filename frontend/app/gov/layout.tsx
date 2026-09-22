import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Government Jobs Newsroom 2026: Notifications, Admit Cards, Results | HireOrbitAI Gov Desk",
  description: "India's next-gen Government Careers Newsroom. Real-time official notifications for SSC CGL, Railway RRB, UP Police, SBI PO, UPSC. Free AI resume eligibility scan & exam copilot.",
  keywords: [
    "Sarkari Result 2026",
    "Sarkari Naukri 2026",
    "Latest Govt Jobs India",
    "SSC CGL 2026 Notification",
    "Railway RRB NTPC Application",
    "UP Police Constable Result",
    "SBI PO Admit Card",
    "Govt job eligibility check AI",
    "HireOrbitAI Gov"
  ],
  openGraph: {
    title: "Government Careers Newsroom 2026 | HireOrbitAI Gov",
    description: "Official real-time government notifications, admit cards, and results. Zero clutter, verified sources, and instant AI eligibility verification.",
    url: "https://hireorbitai.in/gov",
    siteName: "HireOrbitAI Gov Desk",
    type: "website",
  },
  alternates: {
    canonical: "https://hireorbitai.in/gov",
  },
};

export default function GovLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

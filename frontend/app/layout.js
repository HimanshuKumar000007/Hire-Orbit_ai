import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "HireOrbitAi | AI-Powered Resume Analysis",
  description: "Upload your resume and let AI extract your skills, experience, and ideal roles in seconds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} dark antialiased`}>
      <body className="bg-background text-foreground min-h-screen">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_transparent_50%)] opacity-20" />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

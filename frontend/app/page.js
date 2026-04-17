"use client";

import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Notifications } from "@/components/sections/Notifications";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductPreview } from "@/components/sections/ProductPreview";
import { Comparison } from "@/components/sections/Comparison";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      <Hero />
      
      <Features />
      <Notifications />
      <HowItWorks />
      <ProductPreview />
      <Comparison />
      <FinalCTA />
      <Footer />
    </main>
  );
}

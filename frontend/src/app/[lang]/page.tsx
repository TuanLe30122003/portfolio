import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { Projects } from "@/components/sections/Projects";
import { Workflow } from "@/components/sections/Workflow";
import { getAlternates, getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: await getAlternates("/") };
}

/**
 * Scroll flow: vertical → horizontal → vertical → horizontal → vertical.
 * Keep sections in document order — ScrollTriggers are created top to bottom,
 * which is what lets pinned (horizontal) sections push the ones below them.
 */
export default async function HomePage() {
  const t = await getDictionary();

  return (
    <>
      <Hero copy={t.hero} />
      <About />
      <Projects />
      <Experience />
      <Workflow />
      <LatestPosts />
      <Contact />
    </>
  );
}

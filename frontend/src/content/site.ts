// Personal info & navigation.
// Sources: linkedin.com/in/quangtuanle and github.com/TuanLe30122003.
// Text fields take a plain string, or `{ vi, en }` when the translation differs.

import type { Text } from "@/i18n/config";

export const site = {
  /** Browser-tab title; sub-pages render as "<page> · Portfolio". */
  tabTitle: "Portfolio",
  name: "Lê Quang Tuấn",
  /** Name shown large in the hero banner (full `name` is used everywhere else, incl. SEO). */
  heroName: "Quang Tuấn",
  initials: "QT",
  role: "Software Engineer",
  company: "UpBase JSC",
  tagline: {
    vi: "Software Engineer với hơn 2 năm kinh nghiệm phát triển frontend cho các sản phẩm thương mại điện tử và SaaS, chuyên về Next.js, TypeScript và GraphQL.",
    en: "Software Engineer with 2+ years of experience building front-ends for e-commerce and SaaS products, specialising in Next.js, TypeScript and GraphQL.",
  },
  location: { vi: "Hà Nội, Việt Nam", en: "Hanoi, Vietnam" },
  email: "tuanle30122003@gmail.com",
  /** Link to a CV (e.g. "/cv.pdf" in public/). Adds a "Tải CV" button to the hero when set. */
  resume: null as string | null,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  socials: [
    { label: "GitHub", href: "https://github.com/TuanLe30122003" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/quangtuanle/" },
  ],
} as const;

/** `/#id` links scroll within the home page; other paths are regular routes (prefixed per locale). */
export const navItems: { label: Text; href: string }[] = [
  { label: { vi: "Giới thiệu", en: "About" }, href: "/#about" },
  { label: { vi: "Dự án", en: "Work" }, href: "/#work" },
  { label: { vi: "Kinh nghiệm", en: "Experience" }, href: "/#experience" },
  { label: "Blog", href: "/blog" },
  { label: { vi: "Liên hệ", en: "Contact" }, href: "/#contact" },
];

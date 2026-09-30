import type { Dictionary } from "./vi";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const en: Dictionary = {
  ui: {
    header: {
      nav: "Main",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    language: {
      label: "Language",
    },
    error: {
      title: "Something went wrong.",
      body: "The content couldn't be loaded. Please try again later.",
      retry: "Try again",
    },
  },
  layout: {
    skipLink: "Skip to content",
  },
  hero: {
    viewProjects: "View projects",
    contact: "Get in touch",
    downloadCv: "Download CV ↓",
    scrollDown: "Scroll down",
  },
  about: {
    eyebrow: "01 — About",
  },
  projects: {
    label: "Projects",
    eyebrow: "02 — Projects",
    titleLines: ["Selected", "work"],
    intro: (work, personal) =>
      `${plural(work, "product")} I've helped build at UpBase and ${plural(personal, "personal project")}.`,
    scrollHint: "Scroll to explore",
    imageAlt: (title) => `${title} screenshot`,
    githubTitle: "All my code lives on GitHub.",
    githubLink: "View GitHub profile →",
    viewDetails: "View details →",
  },
  project: {
    back: "← All projects",
    overview: "Overview",
    contributions: "Key contributions",
    role: "Role",
    year: "Timeline",
    stack: "Tech stack",
    website: "Visit website ↗",
    more: "More projects",
    notFoundTitle: "Project not found",
  },
  experience: {
    eyebrow: "03 — Experience",
    titleLines: ["Experience", "& education"],
  },
  workflow: {
    label: "How I work",
    eyebrow: "04 — How I work",
    proofLabel: "In practice",
    readBlog: "Read the blog →",
  },
  latestPosts: {
    eyebrow: "05 — Blog",
    title: "Latest writing",
    viewAll: "View all posts →",
    unavailable: "Couldn't load posts. Please try again later.",
    empty: "No posts yet.",
  },
  contact: {
    eyebrow: "06 — Contact",
    title: { before: "Let's ", highlight: "connect", after: "." },
    body: "Email is the fastest way to reach me. You'll find more about my experience on LinkedIn and the source code of my projects on GitHub.",
    detailsLabel: "Contact details",
    email: "Email",
    location: "Location",
  },
  blog: {
    metaTitle: "Blog",
    metaDescription: (name) =>
      `${name}'s engineering blog: notes from real-world projects on front-end development, performance and web architecture.`,
    eyebrow: "Blog",
    title: "Engineering blog",
    intro: "Notes from real-world projects on front-end development, performance and web architecture.",
    filterLabel: "Filter by topic",
    allTags: "All",
    unavailable: "Couldn't load the post list. Please try again later.",
    empty: "No posts here yet.",
    paginationLabel: "Pagination",
    newer: "← Newest",
    older: "Older posts →",
  },
  post: {
    back: "← Blog",
    readingTime: (minutes) => `${minutes} min read`,
    notFoundTitle: "Post not found",
    attachment: "Attachment",
    pdf: "PDF document",
  },
  notFound: {
    title: "Page not found.",
    body: "This link doesn't exist or the content has been removed.",
    home: "Back to home",
    blog: "Read the blog",
  },
};

export default en;

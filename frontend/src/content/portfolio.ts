// Portfolio content rendered on the home page. Edit freely.
// Sources: CV (Documents/CV/Le Quang Tuan.docx), linkedin.com/in/quangtuanle,
// github.com/TuanLe30122003 and the UpBase repositories (your own commits).
// Text fields take a plain string, or `{ vi, en }` when the translation differs.

import type { Text } from "@/i18n/config";
import type { TechIconName } from "./tech-icons";

/** Tech logos orbiting in the hero. Icon names are the keys of content/tech-icons.ts. */
export const heroOrbit: { center: TechIconName; inner: TechIconName[]; outer: TechIconName[] } = {
  center: "nextjs",
  inner: ["react", "typescript", "graphql", "tailwindcss"],
  outer: ["redux", "nodejs", "antdesign", "mui", "figma"],
};

export interface Project {
  /** URL of the detail page: /projects/<slug>. */
  slug: string;
  title: string;
  /** Short label above the title, e.g. "UpBase · Web". Starts with "UpBase" for work projects. */
  context: Text;
  /** What the product is, what it's for and who it serves (not your personal role). */
  summary: Text;
  year: string;
  tags: string[];
  href?: string;
  /**
   * Thumbnail in /public, ~2.08:1 (the card's parallax layer is 130% of a 16:10 frame),
   * key content centred. Without it a generated "planet" artwork is shown.
   */
  image?: string;
  /** Hue (0–360) for the generated artwork. */
  hue: number;
  /** Detail page (/projects/<slug>). */
  details: ProjectDetails;
}

export interface ProjectDetails {
  /** Your position on the project, e.g. "Front-end Developer at UpBase JSC". */
  role: Text;
  /** A few paragraphs: context, what the product does, why it matters. */
  overview: Text[];
  /** What you personally built or changed. Hidden when empty. */
  contributions: Text[];
  /** Stack grouped by layer; `items` read the same in every language. */
  stack: { layer: Text; items: string[] }[];
}

const FRONT_END: Text = "Front-end";
const BACK_END: Text = "Back-end";
const API: Text = "API";
const MOBILE: Text = "Mobile";
const PERSONAL_ROLE: Text = { vi: "Tự thực hiện toàn bộ (dự án cá nhân)", en: "Built end to end (personal project)" };
const UPBASE_ROLE: Text = { vi: "Front-end Developer tại UpBase JSC", en: "Front-end Developer at UpBase JSC" };

/** "About" section: `highlight` is rendered in the accent color between `lead` and `rest`. */
export const about: Record<"lead" | "highlight" | "rest" | "body", Text> = {
  lead: { vi: "Tôi phát triển", en: "I build" },
  highlight: { vi: "frontend", en: "front-ends" },
  rest: { vi: "cho các sản phẩm thương mại điện tử và SaaS.", en: "for e-commerce and SaaS products." },
  body: {
    vi: "Hiện tôi là Software Engineer tại UpBase JSC, phát triển frontend cho các sản phẩm thương mại điện tử và SaaS của công ty: UpAffiliate (web và mobile), UpBeauty, UpS và UpFront. Tôi chú trọng khả năng mở rộng, hiệu năng và thiết kế lấy người dùng làm trung tâm; làm việc trong nhóm Agile–Scrum cùng Backend, Product Manager và QA, luôn hướng tới nâng cao chất lượng mã nguồn và đảm nhận nhiều trách nhiệm kỹ thuật hơn.",
    en: "I'm a Software Engineer at UpBase JSC, building the front-end of the company's e-commerce and SaaS products: UpAffiliate (web and mobile), UpBeauty, UpS and UpFront. I care about scalability, performance and user-centred design, and work in an Agile–Scrum team alongside Backend engineers, Product Managers and QA — always aiming to raise code quality and take on more technical ownership.",
  },
};

/** Skills shown under the About section, grouped for quick scanning. */
export const skills: { group: Text; items: Text[] }[] = [
  {
    group: { vi: "Ngôn ngữ & framework", en: "Languages & frameworks" },
    items: ["TypeScript", "JavaScript", "React", "Next.js", "React Native", "Node.js"],
  },
  {
    group: { vi: "Dữ liệu & state", en: "Data & state" },
    items: ["GraphQL (Apollo, Zeus)", "Redux Toolkit", "TanStack Query", "Zustand", "Unstated-next", "REST API"],
  },
  {
    group: { vi: "Giao diện & animation", en: "UI & animation" },
    items: ["Tailwind CSS", "Ant Design", "NextUI / HeroUI", "Material UI", "NativeWind", "Motion", "Figma"],
  },
  {
    group: { vi: "Quy trình & ngoại ngữ", en: "Process & languages" },
    items: [
      "Agile–Scrum",
      "Git",
      "SEO & GA4",
      "Sentry",
      "Vercel",
      { vi: "Tiếng Anh · IELTS 7.0", en: "English · IELTS 7.0" },
    ],
  },
];

export const stats: { value: number; suffix: string; label: Text }[] = [
  { value: 2, suffix: "+", label: { vi: "năm kinh nghiệm", en: "years of experience" } },
  { value: 5, suffix: "", label: { vi: "sản phẩm tham gia tại UpBase", en: "products built at UpBase" } },
  // Non-merge commits on the main branches of the 5 UpBase products (951 as of 09/2026).
  { value: 900, suffix: "+", label: { vi: "commit vào sản phẩm UpBase", en: "commits to UpBase products" } },
];

export const projects: Project[] = [
  // ── UpBase ────────────────────────────────────────────────────────────
  {
    slug: "upaffiliate",
    title: "UpAffiliate",
    context: { vi: "UpBase · Web · Nền tảng affiliate cho KOC", en: "UpBase · Web · Affiliate platform for KOCs" },
    summary: {
      vi: "Module thuộc hệ sinh thái UpS giúp tự động hoá affiliate marketing: nhãn hàng quản lý mạng lưới đối tác, theo dõi chiến dịch KOC, tính hoa hồng theo thời gian thực và quản lý quy trình gửi sản phẩm mẫu; KOC/KOL có cổng riêng để nhận chiến dịch trên TikTok. Dành cho nhãn hàng và cộng đồng KOC.",
      en: "A module of the UpS ecosystem that automates affiliate marketing: brands manage their partner network, track KOC campaigns, calculate commissions in real time and run the product-sample workflow, while KOCs/KOLs get their own portal to pick up TikTok campaigns. Built for brands and the KOC community.",
    },
    year: "2026",
    tags: ["React", "TypeScript", "Redux Toolkit", "Ant Design", "GraphQL", "Motion"],
    href: "https://upaffiliate.asia",
    image: "/projects/upaffiliate.webp",
    hue: 190,
    details: {
      role: UPBASE_ROLE,
      overview: [
        {
          vi: "Module chuyên biệt tích hợp trong hệ sinh thái UpS để tự động hoá hiệu quả affiliate marketing. Nền tảng giúp công ty quản lý mạng lưới đối tác, theo dõi chiến dịch KOC, tính hoa hồng theo thời gian thực và tinh gọn quy trình gửi sản phẩm mẫu.",
          en: "A dedicated module integrated into the UpS ecosystem to automate affiliate marketing performance. The platform lets the company manage partner networks, track KOC campaigns, calculate commissions in real time and streamline the product-sampling workflow.",
        },
      ],
      contributions: [
        {
          vi: "Xây dựng cổng riêng cho KOC và KOL để quản lý chiến dịch của nhãn hàng và theo dõi các công việc đang thực hiện.",
          en: "Built a dedicated portal for KOCs and KOLs to manage brand campaigns and track ongoing tasks.",
        },
        {
          vi: "Tích hợp TikTok Shop, giúp nhà sáng tạo nội dung đồng bộ cửa hàng của mình với nền tảng chỉ trong vài bước.",
          en: "Integrated TikTok Shop so creators can quickly sync their stores with the platform.",
        },
        {
          vi: "Tạo quy trình tự động xử lý yêu cầu gửi sản phẩm mẫu, theo dõi giao hàng và quản lý hạn đăng review.",
          en: "Created an automated workflow to handle product-sample requests, track deliveries and manage review deadlines.",
        },
      ],
      stack: [
        { layer: FRONT_END, items: ["ReactJS", "Ant Design", "Redux Toolkit", "Motion", "TypeScript"] },
        { layer: BACK_END, items: ["NestJS"] },
        { layer: API, items: ["GraphQL"] },
      ],
    },
  },
  {
    slug: "upaffiliate-mobile",
    title: "UpAffiliate Mobile",
    context: "UpBase · iOS & Android",
    summary: {
      vi: "Phiên bản di động của UpAffiliate trên iOS và Android, giúp KOC theo dõi chiến dịch, nhận job, quản lý deal, sản phẩm mẫu và thu nhập ở bất cứ đâu. Dành cho KOC làm việc chủ yếu trên điện thoại.",
      en: "The iOS and Android version of UpAffiliate, letting KOCs track campaigns, take on jobs and manage deals, product samples and earnings on the go. Built for KOCs who work mostly from their phones.",
    },
    year: "2026",
    tags: ["React Native", "TypeScript", "GraphQL", "NativeWind", "Firebase"],
    image: "/projects/upaffiliate-mobile.webp",
    hue: 205,
    details: {
      role: UPBASE_ROLE,
      overview: [
        {
          vi: "Phiên bản di động của UpAffiliate trên iOS và Android, giúp KOC theo dõi chiến dịch, nhận job, quản lý deal, sản phẩm mẫu và thu nhập ở bất cứ đâu. Dành cho KOC làm việc chủ yếu trên điện thoại.",
          en: "The iOS and Android version of UpAffiliate, letting KOCs track campaigns, take on jobs and manage deals, product samples and earnings on the go. Built for KOCs who work mostly from their phones.",
        },
      ],
      contributions: [
        {
          vi: "Phát triển phiên bản mobile React Native của UpAffiliate cho iOS và Android.",
          en: "Developed the React Native mobile version of UpAffiliate for iOS and Android.",
        },
      ],
      stack: [
        { layer: MOBILE, items: ["React Native", "TypeScript", "NativeWind", "Firebase"] },
        { layer: API, items: ["GraphQL"] },
      ],
    },
  },
  {
    slug: "upbeauty",
    title: "UpBeauty",
    context: { vi: "UpBase · Thương mại điện tử mỹ phẩm", en: "UpBase · Beauty e-commerce" },
    summary: {
      vi: "Kênh bán hàng trực tuyến của UpBase cho mỹ phẩm và chăm sóc sắc đẹp chính hãng, mang trải nghiệm mua sắm cao cấp theo phong cách Shopify và đồng bộ sản phẩm, đơn hàng, khách hàng theo thời gian thực với hệ thống quản trị nội bộ. Dành cho người tiêu dùng mua mỹ phẩm trực tuyến.",
      en: "UpBase's online store for authentic cosmetics and beauty care, offering a premium Shopify-style shopping experience with products, orders and customers synced in real time with the internal back office. Built for shoppers buying cosmetics online.",
    },
    year: "2024–2026",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "GraphQL", "Vendure", "Strapi"],
    href: "https://upbeauty.vn",
    image: "/projects/upbeauty.webp",
    hue: 172,
    details: {
      role: UPBASE_ROLE,
      overview: [
        {
          vi: "Cửa hàng trực tuyến hiệu năng cao, là kênh bán hàng riêng của công ty cho sản phẩm làm đẹp. Nền tảng mang lại trải nghiệm mua sắm cao cấp theo phong cách Shopify, đồng thời đồng bộ dữ liệu theo thời gian thực (sản phẩm, đơn hàng, khách hàng) với hệ thống quản trị nội bộ.",
          en: "A high-performance e-commerce storefront built as the company's dedicated sales channel for beauty products. It delivers a premium, Shopify-inspired shopping experience while syncing real-time data (products, orders, customers) with the core internal management system.",
        },
      ],
      contributions: [
        {
          vi: "Xây dựng các tính năng thương mại điện tử cốt lõi, từ tìm kiếm sản phẩm đến luồng checkout.",
          en: "Built core e-commerce features, from product search to the checkout flow.",
        },
        {
          vi: "Nâng cao trải nghiệm người dùng với giao diện responsive hoàn toàn, thân thiện trên di động và dễ điều hướng.",
          en: "Improved UX with a fully responsive, mobile-friendly and easy-to-navigate interface.",
        },
        {
          vi: "Tối ưu hiệu năng front-end và SEO, giúp trang tải nhanh hơn và dễ được tìm thấy hơn trên công cụ tìm kiếm.",
          en: "Optimised front-end performance and SEO for faster page loads and better search visibility.",
        },
      ],
      stack: [
        { layer: FRONT_END, items: ["Next.js", "Unstated-next", "Tailwind CSS", "NextUI", "TypeScript", "Motion"] },
        { layer: BACK_END, items: ["NestJS", "Vendure", "Strapi"] },
        { layer: API, items: ["GraphQL", "Zeus"] },
      ],
    },
  },
  {
    slug: "ups",
    title: "UpS",
    context: {
      vi: "UpBase · Nền tảng quản trị thương mại hợp nhất",
      en: "UpBase · Unified commerce management platform",
    },
    summary: {
      vi: "Hệ thống quản trị tập trung theo kiến trúc microservices cho vận hành bán hàng đa kênh: người dùng, đơn hàng, tồn kho, chiến dịch marketing, chăm sóc khách hàng và báo cáo, kết nối TikTok Shop, Shopee, Lazada. Dành cho thương hiệu và doanh nghiệp bán hàng trên nhiều sàn.",
      en: "A centralised, microservices-based back office for multichannel sales: users, orders, inventory, marketing campaigns, customer care and reporting, connected to TikTok Shop, Shopee and Lazada. Built for brands and businesses selling across multiple marketplaces.",
    },
    year: "2025–2026",
    tags: ["React", "Redux", "Ant Design", "GraphQL", "Microservices"],
    href: "https://ups.upbase.asia",
    image: "/projects/ups-dashboard.webp",
    hue: 222,
    details: {
      role: UPBASE_ROLE,
      overview: [
        {
          vi: "Sản phẩm SaaS cốt lõi của UpBase: hệ thống quản trị tập trung theo kiến trúc microservices, xử lý dữ liệu đa kênh gồm người dùng, đơn hàng, tồn kho và chiến dịch marketing.",
          en: "UpBase's core SaaS product: a centralised, microservices-based management system handling multichannel data including users, orders, inventory and marketing campaigns.",
        },
      ],
      contributions: [
        {
          vi: "Phát triển và bàn giao các tính năng cốt lõi mới, gồm Dashboard phân tích tương tác và module Loyalty khách hàng.",
          en: "Developed and delivered new core features, including an interactive analytics Dashboard and a customer Loyalty module.",
        },
        {
          vi: "Bảo trì và refactor các module legacy (ReactJS, Redux) để code dễ đọc hơn và hệ thống ổn định hơn.",
          en: "Maintained and refactored legacy modules (ReactJS, Redux) to improve code readability and system stability.",
        },
      ],
      stack: [
        { layer: FRONT_END, items: ["ReactJS", "Ant Design", "MetronicUI", "Redux"] },
        { layer: BACK_END, items: ["Laravel", "NestJS"] },
        { layer: API, items: ["GraphQL"] },
      ],
    },
  },
  {
    slug: "upfront",
    title: "UpFront",
    context: {
      vi: "UpBase · Storefront đa tenant & theme editor",
      en: "UpBase · Multi-tenant storefront & theme editor",
    },
    summary: {
      vi: "Nền tảng tạo website bán hàng cho nhiều thương hiệu trên cùng một hệ thống. Thương hiệu tự thiết kế giao diện bằng trình chỉnh sửa trực quan rồi xuất bản website có sẵn danh mục sản phẩm, giỏ hàng, thanh toán và blog mà không cần viết code. Dành cho thương hiệu muốn có kênh bán hàng riêng (D2C).",
      en: "A platform for running online stores for many brands on a single system. Brands design their storefront in a visual editor, then publish a site with product catalogue, cart, checkout and blog built in — no code required. Built for brands that want their own direct-to-consumer (D2C) channel.",
    },
    year: "2025–2026",
    tags: ["React", "TypeScript", "Ant Design", "Redux Toolkit", "TanStack Query"],
    image: "/projects/upfront.webp",
    hue: 245,
    details: {
      role: UPBASE_ROLE,
      overview: [
        {
          vi: "Nền tảng tạo website bán hàng cho nhiều thương hiệu trên cùng một hệ thống. Thương hiệu tự thiết kế giao diện bằng trình chỉnh sửa trực quan rồi xuất bản website có sẵn danh mục sản phẩm, giỏ hàng, thanh toán và blog mà không cần viết code. Dành cho thương hiệu muốn có kênh bán hàng riêng (D2C).",
          en: "A platform for running online stores for many brands on a single system. Brands design their storefront in a visual editor, then publish a site with product catalogue, cart, checkout and blog built in — no code required. Built for brands that want their own direct-to-consumer (D2C) channel.",
        },
      ],
      contributions: [
        {
          vi: "Xây dựng phiên bản đầu tiên của Theme Editor cho storefront đa thương hiệu.",
          en: "Built the first version of the Theme Editor for the multi-brand storefront.",
        },
      ],
      stack: [{ layer: FRONT_END, items: ["React", "TypeScript", "Ant Design", "Redux Toolkit", "TanStack Query"] }],
    },
  },
  // ── Personal ──────────────────────────────────────────────────────────
  {
    slug: "tech-space",
    title: "Tech Space",
    context: { vi: "Dự án cá nhân · Full-stack", en: "Personal project · Full-stack" },
    summary: {
      vi: "Website thương mại điện tử chuyên đồ công nghệ: khách hàng tìm, so sánh và mua sản phẩm kèm mã khuyến mãi và trợ lý tư vấn AI, còn người bán có trang riêng để quản lý sản phẩm và đơn hàng. Dành cho người mua thiết bị công nghệ và nhà bán nhỏ.",
      en: "An e-commerce site for tech gear: shoppers search, compare and buy products with promo codes and an AI shopping assistant, while sellers get their own dashboard to manage products and orders. Built for tech buyers and small sellers.",
    },
    year: "2025",
    tags: ["Next.js", "MongoDB", "Clerk", "Gemini AI"],
    href: "https://tect-space.vercel.app",
    image: "/projects/tech-space.webp",
    hue: 262,
    details: {
      role: PERSONAL_ROLE,
      overview: [
        {
          vi: "Website thương mại điện tử chuyên đồ công nghệ: khách hàng tìm, so sánh và mua sản phẩm kèm mã khuyến mãi và trợ lý tư vấn AI, còn người bán có trang riêng để quản lý sản phẩm và đơn hàng. Dành cho người mua thiết bị công nghệ và nhà bán nhỏ.",
          en: "An e-commerce site for tech gear: shoppers search, compare and buy products with promo codes and an AI shopping assistant, while sellers get their own dashboard to manage products and orders. Built for tech buyers and small sellers.",
        },
      ],
      contributions: [],
      stack: [{ layer: "Full-stack", items: ["Next.js", "MongoDB", "Clerk", "Gemini AI"] }],
    },
  },
  {
    slug: "adwin-global",
    title: "Adwin Global",
    context: { vi: "Dự án cá nhân · Landing page đa ngôn ngữ", en: "Personal project · Multilingual landing page" },
    summary: {
      vi: "Website giới thiệu dịch vụ của Adwin — cho thuê tài khoản quảng cáo Facebook và phát hành thẻ thanh toán ảo — hỗ trợ 5 ngôn ngữ (EN, DE, FR, RU, ZH). Dành cho đội ngũ affiliate marketing và doanh nghiệp chạy quảng cáo quốc tế.",
      en: "Marketing site for Adwin's services — Facebook ad account rental and virtual payment cards — available in 5 languages (EN, DE, FR, RU, ZH). Built for affiliate marketing teams and businesses running international ads.",
    },
    year: "2025",
    tags: ["Next.js", "next-intl", "Framer Motion", "Zod"],
    href: "https://adwin-global.vercel.app",
    image: "/projects/adwin-global.webp",
    hue: 180,
    details: {
      role: PERSONAL_ROLE,
      overview: [
        {
          vi: "Website giới thiệu dịch vụ của Adwin — cho thuê tài khoản quảng cáo Facebook và phát hành thẻ thanh toán ảo — hỗ trợ 5 ngôn ngữ (EN, DE, FR, RU, ZH). Dành cho đội ngũ affiliate marketing và doanh nghiệp chạy quảng cáo quốc tế.",
          en: "Marketing site for Adwin's services — Facebook ad account rental and virtual payment cards — available in 5 languages (EN, DE, FR, RU, ZH). Built for affiliate marketing teams and businesses running international ads.",
        },
      ],
      contributions: [],
      stack: [{ layer: FRONT_END, items: ["Next.js", "next-intl", "Framer Motion", "Zod"] }],
    },
  },
];

export interface TimelineItem {
  period: Text;
  role: Text;
  company: Text;
  description: Text;
  /** Optional bullet points (key contributions). */
  highlights?: Text[];
}

export const experience: TimelineItem[] = [
  {
    period: { vi: "06/2024 — nay", en: "06/2024 — Present" },
    role: "Software Engineer (Front-end)",
    company: "UpBase JSC",
    description: {
      vi: "Phát triển và bảo trì tính năng cốt lõi cho các nền tảng thương mại điện tử và hệ thống quản trị SaaS trong môi trường Agile/Scrum.",
      en: "Building and maintaining core features for e-commerce platforms and SaaS back-office systems in an Agile/Scrum environment.",
    },
    highlights: [
      {
        vi: "UpBeauty — xây dựng tính năng thương mại điện tử cốt lõi từ tìm kiếm sản phẩm đến checkout; giao diện responsive, tối ưu hiệu năng và SEO.",
        en: "UpBeauty — built core e-commerce features from product search to checkout; responsive UI, performance and SEO optimisation.",
      },
      {
        vi: "UpS — phát triển Dashboard phân tích và module Loyalty khách hàng; refactor các module legacy (React, Redux) để dễ đọc và ổn định hơn.",
        en: "UpS — developed the analytics Dashboard and the customer Loyalty module; refactored legacy modules (React, Redux) for readability and stability.",
      },
      {
        vi: "UpAffiliate — xây dựng cổng cho KOC/KOL quản lý chiến dịch, tích hợp TikTok Shop, tự động hoá quy trình sản phẩm mẫu; phát triển bản mobile React Native.",
        en: "UpAffiliate — built the KOC/KOL campaign portal, integrated TikTok Shop and automated the product-sample workflow; developed the React Native mobile app.",
      },
      {
        vi: "UpFront — xây dựng phiên bản đầu của Theme Editor cho storefront đa thương hiệu.",
        en: "UpFront — built the first version of the Theme Editor for the multi-brand storefront.",
      },
      {
        vi: "Xây dựng thư viện UI component tái sử dụng; phối hợp với Backend và Product Manager tích hợp API cho các nghiệp vụ phức tạp.",
        en: "Built a reusable UI component library; worked with Backend and Product Managers to integrate APIs for complex business flows.",
      },
    ],
  },
  {
    period: "10/2022 — 02/2023",
    role: "Information Technology Intern",
    company: "InfoRe Technology Startup Incubator",
    description: {
      vi: "Bảo trì và phát triển tính năng cho Zisan — hệ thống quản lý nhân sự, sử dụng React.js và CSS.",
      en: "Maintained and built features for Zisan, an HR management system, using React.js and CSS.",
    },
  },
  {
    period: "2021 — 2025",
    role: { vi: "Cử nhân Khoa học Máy tính", en: "B.Sc. in Computer Science" },
    company: { vi: "Trường ĐH Công nghệ – ĐHQG Hà Nội", en: "VNU University of Engineering and Technology" },
    description: {
      vi: "Trường Đại học Công nghệ – Đại học Quốc gia Hà Nội (UET – VNU). CPA 3,25.",
      en: "University of Engineering and Technology, Vietnam National University, Hanoi (UET – VNU). GPA 3.25/4.",
    },
  },
  {
    period: "2018 — 2021",
    role: { vi: "Chuyên Toán", en: "Specialised Mathematics" },
    company: { vi: "THPT Chuyên Bắc Ninh", en: "Bac Ninh High School for the Gifted" },
    description: {
      vi: "Học sinh lớp chuyên Toán, Trường THPT Chuyên Bắc Ninh.",
      en: "Student in the specialised mathematics class at Bac Ninh High School for the Gifted.",
    },
  },
];

export interface WorkPrinciple {
  step: string;
  title: Text;
  description: Text;
  /** A concrete example from real work that backs the principle up. */
  proof: { context: string; text: Text; href?: string };
  tags: string[];
}

/** "How I work" section: principles, each backed by something you actually shipped. */
export const workflow: WorkPrinciple[] = [
  {
    step: "01",
    title: { vi: "Hiểu nghiệp vụ trước khi viết code", en: "Understand the business before the code" },
    description: {
      vi: "Các sản phẩm tôi làm có nghiệp vụ phức tạp: hoa hồng affiliate, quy trình gửi sản phẩm mẫu, đơn hàng đa sàn. Tôi làm rõ luồng dữ liệu và các trường hợp biên cùng Product Manager và Backend trước khi dựng giao diện, để màn hình phản ánh đúng quy trình thật.",
      en: "The products I work on carry complex business logic: affiliate commissions, product-sample workflows, multichannel orders. I pin down data flows and edge cases with Product Managers and Backend before building the UI, so every screen matches how the business actually runs.",
    },
    proof: {
      context: "UpAffiliate",
      text: {
        vi: "Xây dựng cổng cho KOC/KOL quản lý chiến dịch, tích hợp TikTok Shop và tự động hoá quy trình gửi sản phẩm mẫu, trên cả web và React Native.",
        en: "Built the KOC/KOL campaign portal, integrated TikTok Shop and automated the product-sample workflow, on web and React Native.",
      },
    },
    tags: ["GraphQL", "TikTok Shop", "React Native"],
  },
  {
    step: "02",
    title: { vi: "Xây một lần, dùng nhiều nơi", en: "Build once, reuse everywhere" },
    description: {
      vi: "Khi nhiều sản phẩm và thương hiệu chạy trên cùng một hệ thống, tôi ưu tiên component và cấu trúc tái sử dụng được thay vì sao chép: ít lỗi lặp lại, giao diện đồng nhất và tính năng mới ra nhanh hơn.",
      en: "When many products and brands run on one system, I favour reusable components and structure over copy-paste: fewer repeated bugs, a consistent UI and faster new features.",
    },
    proof: {
      context: "UpFront",
      text: {
        vi: "Xây dựng phiên bản đầu của Theme Editor cho storefront đa thương hiệu, cùng thư viện UI component tái sử dụng.",
        en: "Built the first version of the Theme Editor for the multi-brand storefront, plus a reusable UI component library.",
      },
    },
    tags: ["React", "TypeScript", "Redux Toolkit"],
  },
  {
    step: "03",
    title: { vi: "Hiệu năng và SEO là một phần của tính năng", en: "Performance and SEO are part of the feature" },
    description: {
      vi: "Với thương mại điện tử, tốc độ tải trang và khả năng được tìm thấy ảnh hưởng trực tiếp đến doanh thu. Tôi tính đến responsive, hiệu năng và SEO ngay khi xây tính năng, không để dành đến cuối.",
      en: "In e-commerce, page speed and discoverability hit revenue directly. I build responsiveness, performance and SEO into a feature from the start instead of leaving them for the end.",
    },
    proof: {
      context: "UpBeauty",
      text: {
        vi: "Xây dựng các tính năng thương mại điện tử cốt lõi từ tìm kiếm sản phẩm đến checkout, với giao diện responsive, tối ưu hiệu năng và SEO.",
        en: "Built the core e-commerce features from product search to checkout, with a responsive UI, performance and SEO optimisation.",
      },
    },
    tags: ["Next.js", "SEO", "GA4"],
  },
  {
    step: "04",
    title: { vi: "Để lại code tốt hơn lúc nhận", en: "Leave the code better than I found it" },
    description: {
      vi: "Sản phẩm sống lâu hơn một sprint. Tôi refactor dần những phần cũ khi chạm vào, review code trong nhóm Agile–Scrum và phối hợp với QA để mỗi bản phát hành ổn định hơn bản trước.",
      en: "Products outlive any sprint. I refactor older code as I touch it, review code within an Agile–Scrum team and work with QA so each release is more stable than the last.",
    },
    proof: {
      context: "UpS",
      text: {
        vi: "Refactor các module legacy (React, Redux) để dễ đọc và ổn định hơn, song song phát triển Dashboard phân tích và module Loyalty khách hàng.",
        en: "Refactored legacy React/Redux modules for readability and stability while building the analytics Dashboard and the customer Loyalty module.",
      },
    },
    tags: ["React", "Redux", "Refactoring"],
  },
  {
    step: "05",
    title: { vi: "Học liên tục và ghi lại", en: "Keep learning, write it down" },
    description: {
      vi: "Tôi ghi chép lại những gì học được về JavaScript, React, hiệu năng và phỏng vấn frontend, và đọc tài liệu kỹ thuật gốc bằng tiếng Anh (IELTS 7.0).",
      en: "I write up what I learn about JavaScript, React, performance and front-end interviews, and read technical docs in English at the source (IELTS 7.0).",
    },
    proof: {
      context: "Blog",
      text: {
        vi: "Các bài ghi chép kỹ thuật được viết trên Notion và tự đăng lên blog của chính website này.",
        en: "Technical notes written in Notion and published automatically to this site's blog.",
      },
      href: "/blog",
    },
    tags: ["Notion", "JavaScript", "React"],
  },
];

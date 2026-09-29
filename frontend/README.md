# Frontend — Next.js

Portfolio với scroll animation dọc → ngang → dọc và blog lấy từ backend. Xem hướng dẫn đầy đủ ở [README gốc](../README.md).

```bash
cp .env.example .env.local
npm run dev          # http://localhost:3000 (cần backend chạy ở :4000 cho phần blog)
npm run build        # production build (output: standalone)
npm run lint         # ESLint
npm run typecheck    # next typegen + tsc
npm run format       # Prettier
```

```
src/
├── app/
│   ├── [lang]/                  # mọi trang, theo ngôn ngữ (vi ở URL gốc, en ở /en)
│   │   ├── layout.tsx           # <html lang>, font, I18nProvider, SmoothScroll (Lenis), header/footer
│   │   ├── page.tsx             # trang chủ: Hero → About → Projects(H) → Experience → Workflow(H) → Blog → Contact
│   │   ├── blog/page.tsx        # danh sách + lọc tag + phân trang
│   │   ├── blog/[slug]/page.tsx # bài viết (prerender các slug đã biết)
│   │   ├── blog/rss.xml/route.ts# RSS
│   │   ├── [...rest]/page.tsx   # 404 theo ngôn ngữ cho đường dẫn lạ
│   │   └── not-found.tsx, error.tsx
│   ├── api/revalidate/route.ts  # webhook làm mới cache blog
│   └── sitemap.ts, robots.ts
├── proxy.ts                     # định tuyến ngôn ngữ (rewrite /… → /vi/…, phát hiện tiếng Anh)
├── i18n/                        # config (locales, localizePath), dictionaries/{vi,en}.ts, server.ts, client.tsx
├── components/
│   ├── motion/                  # HorizontalScroll, Reveal, CountUp, ScrollLine
│   ├── sections/                # các section của trang chủ
│   ├── blog/                    # Markdown (Notion), PostCard, PostCover, ReadingProgress
│   ├── layout/ providers/ ui/
├── content/                     # site.ts, portfolio.ts — sửa nội dung ở đây
├── hooks/useHashNavigation.ts   # cuộn mượt tới /#section
├── lib/
│   ├── api/                     # apiFetch + các hàm 'use cache' cho blog
│   ├── gsap.ts                  # đăng ký plugin GSAP một lần
│   └── notion-markdown.ts       # chuẩn hoá Notion-flavored Markdown
└── types/blog.ts
```

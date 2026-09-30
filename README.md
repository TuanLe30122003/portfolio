# Portfolio + Notion Blog

Portfolio cá nhân với scroll animation **dọc → ngang → dọc** (lấy cảm hứng từ [legospace.tilda.ws](https://legospace.tilda.ws/classicspace)) và blog viết trên **Notion**.

| App | Stack | Cổng |
| --- | --- | --- |
| [`frontend/`](frontend) | Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, GSAP 3 + ScrollTrigger, Lenis | 3000 |
| [`backend/`](backend) | NestJS 12 (ESM), Notion SDK v5 (API `2025-09-03`), cache-manager, Vitest | 4000 |

```
 Notion database ──(Notion API)──▶ NestJS  /api/blog/*  ──(JSON)──▶ Next.js  /blog, /blog/[slug]
                                   cache in-memory 5'               'use cache' + cacheTag("blog")
                                          ▲                                   │
                                          └──── POST /api/revalidate ◀────────┘  (webhook / thủ công)
```

Frontend **không bao giờ** gọi Notion trực tiếp; token Notion chỉ nằm ở backend.

---

## 1. Chạy local

Yêu cầu: **Node ≥ 22.22** (khuyên dùng Node 24 LTS) và **npm ≥ 11**.

> npm 10.9 có lỗi `Cannot read properties of null (reading 'edgesOut')` khi cài cây dependency của NestJS 12. Nâng cấp bằng `npm i -g npm@11` hoặc dùng `npx npm@11 install`.

```bash
npm install          # cài concurrently ở root
npm run setup        # cài dependency cho backend + frontend
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run dev          # API :4000 + web :3000
```

Chưa cấu hình Notion? Backend tự dùng **`MockPostsRepository`** (3 bài mẫu, cùng định dạng Markdown mà Notion trả về) nên bạn vẫn dựng giao diện được ngay.

## 2. Kết nối Notion

1. Tạo integration tại <https://www.notion.so/profile/integrations> → copy **Internal Integration Secret** vào `NOTION_TOKEN`.
2. Tạo một database cho blog với các cột (đổi tên trong [`backend/src/blog/blog.schema.ts`](backend/src/blog/blog.schema.ts) nếu muốn):

   | Cột | Kiểu | Ghi chú |
   | --- | --- | --- |
   | `Name` | Title | Tiêu đề bài |
   | `Slug` | Text | URL `/blog/<slug>`; để trống → dùng ID trang |
   | `Description` | Text | Mô tả ngắn / SEO |
   | `Tags` | Multi-select | Bộ lọc chủ đề ở `/blog` |
   | `Published` | Checkbox | **Chỉ bài được tick mới hiển thị** |
   | `Date` | Date | Sắp xếp mới nhất trước |

   Ảnh bìa lấy từ **cover** của trang Notion.
3. Mở database → `•••` → **Connections** → thêm integration của bạn (không làm bước này sẽ nhận lỗi 502 "database not found").
4. Dán **URL hoặc ID** của database vào `NOTION_DATABASE_ID`. Backend tự tìm data source đầu tiên của database (Notion API 2025‑09‑03); nếu database có nhiều data source, đặt thẳng `NOTION_DATA_SOURCE_ID`.

Nội dung bài được lấy bằng endpoint chính thức `GET /v1/pages/:id/markdown` ([Notion‑flavored Markdown](https://developers.notion.com/guides/data-apis/enhanced-markdown)) — không cần thư viện convert block. Frontend chuẩn hoá định dạng này trong [`lib/notion-markdown.ts`](frontend/src/lib/notion-markdown.ts) và render callout, toggle, columns, bảng, mention, màu chữ… trong [`components/blog/Markdown.tsx`](frontend/src/components/blog/Markdown.tsx) (code block tô màu bằng Shiki).

### Cập nhật bài ngay sau khi sửa trên Notion

Mặc định dữ liệu tự làm mới sau tối đa ~20 phút (cache API 5' + profile `notion` của Next: revalidate 15'). Muốn cập nhật ngay:

```bash
curl -X POST http://localhost:3000/api/revalidate -H "x-revalidate-secret: $REVALIDATE_SECRET"
```

Route này xoá cache của API rồi gọi `revalidateTag("blog", { expire: 0 })`. Có thể gắn vào **Notion database automation → Send webhook** (thêm custom header `x-revalidate-secret`) để tự chạy mỗi khi bạn tick *Published*.

> Link file/ảnh upload lên Notion là URL ký sẵn, **hết hạn sau ~1 giờ**. Vì vậy mọi tầng cache đều giữ dưới mốc đó (`CACHE_TTL_SECONDS ≤ 3000`, profile `notion` expire 45'). Nếu cần giữ ảnh lâu hơn, hãy host ảnh ngoài (Cloudinary, S3…) và dùng link ngoài trong Notion.

## 3. Hệ thống animation dọc → ngang → dọc

Trang chủ ([`app/page.tsx`](frontend/src/app/page.tsx)) xếp section theo nhịp:

```
Hero (V) → About (V) → Projects (H, pin) → Experience (V) → Workflow (H, pin) → Blog (V) → Contact (V)
```

- **Lenis** làm mượt cuộn, chạy chung vòng `requestAnimationFrame` với GSAP ([`SmoothScroll.tsx`](frontend/src/components/providers/SmoothScroll.tsx)).
- **[`<HorizontalScroll>`](frontend/src/components/motion/HorizontalScroll.tsx)** là "đoạn ngang": pin section vào viewport và quy đổi quãng cuộn dọc thành `translateX` của track. Phần tử con tham gia animation bằng data attribute — giống cơ chế step‑by‑step của Tilda:

  | Attribute | Tác dụng |
  | --- | --- |
  | `data-h-reveal` | Hiện dần khi đi vào từ bên phải |
  | `data-h-speed="0.3"` | Parallax so với track (đặt trong phần tử có `data-h-item`) |
  | `data-h-progress` | (overlay) thanh tiến trình `scaleX` theo section |
  | `data-h-fly` + `data-h-fly-y`, `data-h-fly-rotate`, `data-h-fly-range="0.1,0.9"` | (overlay) vật thể bay ngang màn hình, như tên lửa trong trang Lego |

- Đoạn dọc dùng [`<Reveal>`](frontend/src/components/motion/Reveal.tsx) (fade‑up, `data-reveal-item` để stagger), [`<CountUp>`](frontend/src/components/motion/CountUp.tsx), [`<ScrollLine>`](frontend/src/components/motion/ScrollLine.tsx) và parallax `data-speed` trong Hero.
- `prefers-reduced-motion: reduce` → không pin, không animation; section ngang trở thành thanh cuộn ngang native có snap.

Thêm một đoạn ngang mới:

```tsx
<HorizontalScroll id="gallery" aria-label="Gallery" overlay={<div data-h-fly className="absolute top-1/4">🚀</div>}>
  {items.map((item) => (
    <article key={item.id} data-h-item data-h-reveal className="w-[70vw] shrink-0">…</article>
  ))}
</HorizontalScroll>
```

Giữ các section theo đúng thứ tự trong DOM — ScrollTrigger tạo từ trên xuống nên section pin phía trên mới đẩy được các section bên dưới.

## 4. Nội dung & điều hướng

- Thông tin cá nhân, menu: [`frontend/src/content/site.ts`](frontend/src/content/site.ts)
- Dự án, kinh nghiệm, quy trình: [`frontend/src/content/portfolio.ts`](frontend/src/content/portfolio.ts) (thêm `image: "/projects/x.jpg"` vào `public/` để thay artwork tự sinh)
- Header ([`SiteHeader.tsx`](frontend/src/components/layout/SiteHeader.tsx)): link `/#id` cuộn mượt trong trang chủ, `/blog` là route riêng; tự ẩn khi cuộn xuống, hiện khi cuộn lên, highlight section đang xem, menu toàn màn hình trên mobile, nút chuyển ngôn ngữ `VI | EN`.

## 5. Đa ngôn ngữ (Tiếng Việt / English)

| URL | Ngôn ngữ |
| --- | --- |
| `/`, `/blog`, `/blog/<slug>` | Tiếng Việt (mặc định, URL giữ nguyên như trước) |
| `/en`, `/en/blog`, `/en/blog/<slug>` | English |

- Mọi trang nằm dưới [`app/[lang]/`](frontend/src/app/[lang]) và được prerender cho từng ngôn ngữ. [`src/proxy.ts`](frontend/src/proxy.ts) rewrite URL không có tiền tố sang `/vi/...`; `/vi/...` được redirect về URL gọn.
- Lần đầu vào trang, khách có trình duyệt ưu tiên tiếng Anh (hoặc một ngôn ngữ chưa hỗ trợ) được chuyển sang `/en`. Khi bấm `VI | EN`, lựa chọn được lưu vào cookie `NEXT_LOCALE` và được ưu tiên hơn cài đặt trình duyệt.
- **Chuỗi giao diện** (tiêu đề, nút, thông báo): [`i18n/dictionaries/vi.ts`](frontend/src/i18n/dictionaries/vi.ts) và [`en.ts`](frontend/src/i18n/dictionaries/en.ts) — TypeScript báo lỗi nếu `en.ts` thiếu key.
- **Nội dung** (`content/*.ts`): trường văn bản nhận chuỗi thường nếu giống nhau ở mọi ngôn ngữ, hoặc `{ vi: "…", en: "…" }` nếu cần dịch.
- Server Component lấy ngôn ngữ bằng `getLocale()` / `getDictionary()` ([`i18n/server.ts`](frontend/src/i18n/server.ts), dựa trên `next/root-params`); Client Component dùng `useI18n()`. Link nội bộ đi qua `localizePath(href, locale)` (`<HashLink>` tự làm việc này).
- Metadata có `canonical` + `hreflang` cho mỗi trang, sitemap liệt kê cả hai ngôn ngữ, RSS có ở `/blog/rss.xml` và `/en/blog/rss.xml`.
- Bài blog lấy từ Notion hiển thị như nhau ở cả hai ngôn ngữ (chỉ giao diện xung quanh được dịch).

Thêm ngôn ngữ mới: thêm mã vào `locales` + `localeInfo` trong [`i18n/config.ts`](frontend/src/i18n/config.ts), tạo dictionary mới, thêm bản dịch cho các trường `{ vi, en }` trong `content/` và một formatter ngày trong [`lib/format.ts`](frontend/src/lib/format.ts) — TypeScript sẽ chỉ ra chỗ còn thiếu.

## 6. API (backend)

| Method | Path | Mô tả |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/blog/posts?tag=&cursor=&limit=` | Danh sách bài đã publish (phân trang bằng cursor) |
| GET | `/api/blog/posts/:slug` | Chi tiết bài + `content` (Markdown) + `readingTimeMinutes` |
| GET | `/api/blog/tags` | Các tag lấy từ schema cột `Tags` |
| POST | `/api/blog/revalidate` | Xoá cache Notion (header `x-revalidate-secret`) |

Lỗi từ Notion (sai token, chưa share database, rate limit) được [`NotionExceptionFilter`](backend/src/notion/notion-exception.filter.ts) đổi thành 502/503/504 kèm thông báo dễ hiểu.

## 7. Scripts

| Lệnh (ở root) | |
| --- | --- |
| `npm run dev` | Chạy cả API và web |
| `npm run build` | Build cả hai |
| `npm test` | Unit + e2e test của backend (Vitest) |
| `npm run lint` / `npm run typecheck` | oxlint (BE), ESLint + tsc (FE) |

## 8. Triển khai

- **Docker**: `cp .env.example .env` (đặt `REVALIDATE_SECRET`), tạo `backend/.env`, rồi `docker compose up --build`. Frontend build ở chế độ `output: "standalone"`; nếu API chưa chạy lúc build, trang blog sẽ được render ở request đầu tiên rồi cache lại.
- **Vercel** (cả hai app): mỗi app là một project riêng, **Root Directory** lần lượt là `frontend` và `backend`; push lên `main` sẽ tự deploy.
  - Backend chạy như một Vercel Function (preset NestJS). [`backend/vercel.json`](backend/vercel.json) đặt `outputDirectory: "dist"` để Vercel dùng `dist/main.js` do `nest build` biên dịch, thay vì tự biên dịch lại `src/main.ts` (bước đó của Vercel báo lỗi type sai với `import helmet from 'helmet'`).
  - Biến môi trường — backend: `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `REVALIDATE_SECRET`, `CORS_ORIGIN` (domain FE); frontend: `API_URL` (`https://<backend>.vercel.app/api`), `NEXT_PUBLIC_SITE_URL` (domain FE), `REVALIDATE_SECRET` (giống backend). Đổi biến xong phải redeploy.
  - Cache Notion của API nằm trong bộ nhớ từng instance: `/api/revalidate` chỉ xoá cache của instance nhận request, các instance khác tự hết hạn sau `CACHE_TTL_SECONDS` (mặc định 5').
- **Tách dịch vụ khác**: frontend lên Vercel; backend lên Railway / Render / Fly.io. Đặt `API_URL` (FE) trỏ về backend, `CORS_ORIGIN` (BE) là domain FE, và cùng một `REVALIDATE_SECRET` ở cả hai.

## Ghi chú

- Next.js 16 dùng Cache Components: trang tĩnh được prerender, dữ liệu blog cache bằng `'use cache'` + `cacheLife("notion")` + `cacheTag("blog")`. Khi API lỗi, kết quả chỉ được cache vài giây để không "đóng băng" lỗi vào trang.
- Slug không tồn tại hiển thị trang 404 (có `noindex`) trong phần nội dung được stream; vì shell đã gửi trước nên HTTP status là 200 — đây là hành vi chuẩn của Next 16 với streaming.
- Kiểu dữ liệu bài viết được khai báo ở cả [`backend/.../post.interface.ts`](backend/src/blog/interfaces/post.interface.ts) và [`frontend/src/types/blog.ts`](frontend/src/types/blog.ts) — sửa một bên thì sửa cả bên kia (hoặc tách thành package dùng chung nếu dự án lớn dần).

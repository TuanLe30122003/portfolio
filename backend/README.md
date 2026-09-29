# Backend — NestJS API

API đọc blog từ Notion cho frontend. Xem hướng dẫn đầy đủ ở [README gốc](../README.md).

```bash
cp .env.example .env     # để trống NOTION_TOKEN → dùng bài mẫu
npm run start:dev        # http://localhost:4000/api
npm test                 # unit test (Vitest)
npm run test:e2e         # e2e test với MockPostsRepository
npm run lint             # oxlint
```

```
src/
├── main.ts / app.setup.ts     # bootstrap; prefix /api, helmet, CORS, ValidationPipe (dùng chung cho e2e)
├── app.module.ts              # ConfigModule (validate env) + CacheModule (global)
├── config/env.validation.ts   # biến môi trường có kiểu + validate lúc khởi động
├── common/guards/             # RevalidateSecretGuard
├── health/                    # GET /api/health
├── notion/                    # Notion client (token NOTION_CLIENT), filter lỗi Notion, helper đọc property
└── blog/
    ├── blog.controller.ts     # /api/blog/*
    ├── blog.service.ts        # cache-manager bọc repository
    ├── blog.schema.ts         # tên cột trong database Notion
    ├── dto/ interfaces/
    └── repositories/
        ├── posts.repository.ts        # abstract class = DI token
        ├── notion-posts.repository.ts # dataSources.query + pages.retrieveMarkdown
        ├── notion-post.mapper.ts      # Notion page → PostSummary
        └── mock-posts.repository.ts   # dùng khi chưa có NOTION_TOKEN
```

Muốn đổi nguồn dữ liệu (CMS khác, database…)? Viết class mới `extends PostsRepository` và trả nó trong factory ở `blog.module.ts` — controller/service không cần sửa.

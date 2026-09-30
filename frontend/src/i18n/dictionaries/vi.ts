// UI strings (headings, buttons, messages). Portfolio content itself — projects,
// experience, tagline… — is translated inline in src/content/*.ts.
// en.ts must have exactly the same shape (enforced by the `Dictionary` type).

const vi = {
  /** Read by Client Components through <I18nProvider>: plain strings only, no functions. */
  ui: {
    header: {
      nav: "Chính",
      openMenu: "Mở menu",
      closeMenu: "Đóng menu",
    },
    language: {
      label: "Ngôn ngữ",
    },
    error: {
      title: "Đã có lỗi xảy ra.",
      body: "Không tải được nội dung. Vui lòng thử lại sau.",
      retry: "Thử lại",
    },
  },
  layout: {
    skipLink: "Bỏ qua điều hướng",
  },
  /** Passed as props to the (client) Hero: plain strings only. */
  hero: {
    viewProjects: "Xem dự án",
    contact: "Liên hệ",
    downloadCv: "Tải CV ↓",
    scrollDown: "Cuộn xuống",
  },
  about: {
    eyebrow: "01 — Giới thiệu",
  },
  projects: {
    label: "Dự án",
    eyebrow: "02 — Dự án",
    titleLines: ["Dự án", "chọn lọc"],
    intro: (work: number, personal: number) =>
      `${work} sản phẩm tôi tham gia phát triển tại UpBase và ${personal} dự án cá nhân tiêu biểu.`,
    scrollHint: "Cuộn để xem",
    imageAlt: (title: string) => `Giao diện ${title}`,
    githubTitle: "Toàn bộ mã nguồn có trên GitHub.",
    githubLink: "Xem hồ sơ GitHub →",
    viewDetails: "Xem chi tiết →",
  },
  project: {
    back: "← Tất cả dự án",
    overview: "Tổng quan",
    contributions: "Đóng góp chính",
    role: "Vai trò",
    year: "Thời gian",
    stack: "Công nghệ",
    website: "Truy cập website ↗",
    more: "Dự án khác",
    notFoundTitle: "Không tìm thấy dự án",
  },
  experience: {
    eyebrow: "03 — Kinh nghiệm",
    titleLines: ["Kinh nghiệm", "& học vấn"],
  },
  workflow: {
    label: "Cách tôi làm việc",
    eyebrow: "04 — Cách tôi làm việc",
    proofLabel: "Trong thực tế",
    readBlog: "Đọc blog →",
  },
  latestPosts: {
    eyebrow: "05 — Blog",
    title: "Bài viết kỹ thuật",
    viewAll: "Xem tất cả bài viết →",
    unavailable: "Không tải được bài viết. Vui lòng thử lại sau.",
    empty: "Chưa có bài viết nào.",
  },
  contact: {
    eyebrow: "06 — Liên hệ",
    /** Rendered as `${before}<accent>${highlight}</accent>${after}`. */
    title: { before: "Hãy ", highlight: "kết nối", after: " với tôi." },
    body: "Email là cách nhanh nhất để liên hệ với tôi. Thông tin chi tiết về kinh nghiệm có trên LinkedIn, mã nguồn các dự án có trên GitHub.",
    detailsLabel: "Thông tin liên hệ",
    email: "Email",
    location: "Địa điểm",
  },
  blog: {
    metaTitle: "Blog",
    metaDescription: (name: string) =>
      `Blog kỹ thuật của ${name}: ghi chép từ các dự án thực tế về frontend, hiệu năng và kiến trúc ứng dụng web.`,
    eyebrow: "Blog",
    title: "Blog kỹ thuật",
    intro: "Ghi chép từ các dự án thực tế về frontend, hiệu năng và kiến trúc ứng dụng web.",
    filterLabel: "Lọc theo chủ đề",
    allTags: "Tất cả",
    unavailable: "Không tải được danh sách bài viết. Vui lòng thử lại sau.",
    empty: "Chưa có bài viết nào ở đây.",
    paginationLabel: "Phân trang",
    newer: "← Mới nhất",
    older: "Bài cũ hơn →",
  },
  post: {
    back: "← Blog",
    readingTime: (minutes: number) => `${minutes} phút đọc`,
    notFoundTitle: "Không tìm thấy bài viết",
    attachment: "Tệp đính kèm",
    pdf: "Tài liệu PDF",
  },
  notFound: {
    title: "Không tìm thấy trang.",
    body: "Đường dẫn không tồn tại hoặc nội dung đã được gỡ.",
    home: "Về trang chủ",
    blog: "Xem blog",
  },
};

export type Dictionary = typeof vi;
export default vi;

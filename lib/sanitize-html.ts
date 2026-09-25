import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
];

// Bài giới thiệu chỉ do admin đã đăng nhập (JWT xác thực qua proxy.ts) soạn, nhưng vẫn
// sanitize trước khi lưu — HTML này sẽ render thẳng bằng dangerouslySetInnerHTML trên trang
// public, phòng trường hợp tài khoản admin bị chiếm hoặc nội dung dán vào chứa script lạ.
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href", "target", "rel"] },
  });
}

// TipTap trả về "<p></p>" (không phải chuỗi rỗng) khi editor trống — coi các biến thể
// "không có nội dung nhìn thấy" này là rỗng để trang public không render 1 khối trống.
export function isArticleEmpty(html: string): boolean {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim().length === 0;
}

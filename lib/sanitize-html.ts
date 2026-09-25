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
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

// Chỉ chấp nhận ảnh trỏ về chính domain này (vd: /uploads/articles/xxx.png) — chặn hotlink
// ảnh ngoài (tracking pixel, ảnh độc hại giả dạng) lẫn vào bài viết qua paste HTML.
function isRelativeImageSrc(src: string | undefined): boolean {
  return typeof src === "string" && src.startsWith("/") && !src.startsWith("//");
}

// Bài giới thiệu chỉ do admin đã đăng nhập (JWT xác thực qua proxy.ts) soạn, nhưng vẫn
// sanitize trước khi lưu — HTML này sẽ render thẳng bằng dangerouslySetInnerHTML trên trang
// public, phòng trường hợp tài khoản admin bị chiếm hoặc nội dung dán vào (từ Word...) chứa
// script/style lạ.
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !isRelativeImageSrc(frame.attribs.src),
  });
}

// TipTap trả về "<p></p>" (không phải chuỗi rỗng) khi editor trống — coi các biến thể
// "không có nội dung nhìn thấy" (không chữ, không ảnh) là rỗng để trang public không render
// 1 khối trống.
export function isArticleEmpty(html: string): boolean {
  const textOnly = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
  if (textOnly.length > 0) return false;
  return !sanitizeHtml(html, { allowedTags: ["img"], allowedAttributes: {} }).includes("<img");
}

import type { NextRequest } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// In-memory, đủ dùng cho quy mô landing page + lead capture (mục 3.4 TDD không yêu cầu
// Redis/dịch vụ ngoài). Lưu ý: khi deploy serverless nhiều instance, giới hạn này tính
// riêng theo từng instance chứ không dùng chung store toàn cục.
const store = new Map<string, RateLimitEntry>();

// Giới hạn kích thước store: nếu có rất nhiều IP khác nhau ghé qua (hoặc bị spam bằng
// header giả mạo), dọn bớt entry đã hết hạn thay vì để Map phình vô hạn.
const MAX_STORE_SIZE = 5000;

function sweepExpiredEntries(now: number): void {
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    if (store.size >= MAX_STORE_SIZE) {
      sweepExpiredEntries(now);
    }
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

export function getClientIp(request: NextRequest): string {
  // x-real-ip: 1 giá trị duy nhất, do reverse proxy đáng tin cậy (Vercel) ghi đè —
  // không thể bị client giả mạo.
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // x-forwarded-for có thể là chuỗi nhiều IP nối bằng dấu phẩy: client -> proxy1 -> proxy2...
  // Client tự thêm được các giá trị ở ĐẦU chuỗi, nhưng không thể giả mạo giá trị proxy gần
  // nhất (server) vừa thêm vào — nên lấy phần tử CUỐI thay vì đầu để tránh bị giả mạo.
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",").map((part) => part.trim());
    return parts[parts.length - 1];
  }

  return "unknown";
}

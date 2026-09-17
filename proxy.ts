import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_MAX_AGE_SECONDS,
  ADMIN_COOKIE_NAME,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/auth";

// Next.js 16 đổi tên middleware.ts -> proxy.ts (cùng chức năng, mặc định chạy Node.js
// runtime). Đây là nơi xác thực JWT cho toàn bộ /api/admin/* theo mục 5 TDD.
export function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? verifyAdminToken(token) : null;

  if (!payload) {
    // /api/auth/logout phải luôn tới được route handler để xoá cookie phía client, kể cả
    // khi JWT đã hết hạn/không hợp lệ — nếu không, phiên hết hạn sẽ không bao giờ đăng
    // xuất được (cookie cũ kẹt lại trình duyệt).
    if (request.nextUrl.pathname === "/api/auth/logout") {
      return NextResponse.next();
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Truyền danh tính admin xuống route handler qua header (dùng cho updatedBy...).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-id", payload.sub);
  requestHeaders.set("x-admin-email", payload.email);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Sliding session: gia hạn cookie 8h khi admin còn hoạt động (mục 5 TDD).
  const refreshedToken = signAdminToken({ sub: payload.sub, email: payload.email });
  response.cookies.set(ADMIN_COOKIE_NAME, refreshedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
  });

  return response;
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/auth/logout"],
};

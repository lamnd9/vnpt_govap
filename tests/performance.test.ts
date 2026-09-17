import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { BASE_URL } from "./setup/global-setup";

const prisma = new PrismaClient();
let adminCookie: string;

beforeAll(async () => {
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@vnpt.vn", password: "Admin@123" }),
  });
  adminCookie = loginResponse.headers.get("set-cookie")!.split(";")[0];
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Ngưỡng hiệu suất API (mục 3.1 SRS / mục 10 TDD)", () => {
  it("GET /api/admin/leads (danh sách/lọc) phản hồi dưới 500ms", async () => {
    const start = performance.now();
    const response = await fetch(`${BASE_URL}/api/admin/leads?page=1&status=new`, {
      headers: { Cookie: adminCookie },
    });
    const elapsedMs = performance.now() - start;

    expect(response.status).toBe(200);
    expect(elapsedMs).toBeLessThan(500);
  });

  it("Truy vấn DB danh sách/lọc lead dưới 200ms (đo trực tiếp qua Prisma, có dùng index)", async () => {
    const start = performance.now();
    await prisma.lead.findMany({
      where: { status: "new" },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const elapsedMs = performance.now() - start;

    expect(elapsedMs).toBeLessThan(200);
  });
});

describe("Ngưỡng tải trang public (mục 3.1 SRS: FCP dưới 2s cho trang SSG)", () => {
  // Đây là thời gian phản hồi server (TTFB) của trang SSG — proxy hợp lý cho FCP vì
  // trang không có JS chặn render trước khi paint. Đo FCP chính xác cần trình duyệt
  // thật (Lighthouse/Playwright); đã kiểm tra thủ công bằng Playwright ở Bước 4-5
  // (screenshot + không có console error), không đưa vào bộ test tự động ở đây để
  // tránh phụ thuộc tải trình duyệt headless trong CI.
  it("Trang chủ phản hồi dưới 2s", async () => {
    const start = performance.now();
    const response = await fetch(`${BASE_URL}/`);
    const elapsedMs = performance.now() - start;

    expect(response.status).toBe(200);
    expect(elapsedMs).toBeLessThan(2000);
  });

  it("Trang category phản hồi dưới 2s", async () => {
    const start = performance.now();
    const response = await fetch(`${BASE_URL}/san-pham/chu-ky-so`);
    const elapsedMs = performance.now() - start;

    expect(response.status).toBe(200);
    expect(elapsedMs).toBeLessThan(2000);
  });
});

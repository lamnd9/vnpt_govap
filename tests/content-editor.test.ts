import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Prisma, PrismaClient } from "@prisma/client";
import { BASE_URL } from "./setup/global-setup";

const prisma = new PrismaClient();
const TEST_SLUG = "chu-ky-so";

let adminCookie: string;
let originalContent: {
  hero: Prisma.JsonValue;
  features: Prisma.JsonValue;
  pricing: Prisma.JsonValue;
  faq: Prisma.JsonValue;
  illustrationUrl: string | null;
  showFeatures: boolean;
  showFaq: boolean;
  pricingLayout: string;
  pricingColumns: Prisma.JsonValue;
};

beforeAll(async () => {
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@vnpt.vn", password: "Admin@123" }),
  });
  adminCookie = loginResponse.headers.get("set-cookie")!.split(";")[0];

  const category = await prisma.category.findUniqueOrThrow({ where: { slug: TEST_SLUG } });
  originalContent = {
    hero: category.hero,
    features: category.features,
    pricing: category.pricing,
    faq: category.faq,
    illustrationUrl: category.illustrationUrl,
    showFeatures: category.showFeatures,
    showFaq: category.showFaq,
    pricingLayout: category.pricingLayout,
    pricingColumns: category.pricingColumns,
  };
});

afterAll(async () => {
  // Khôi phục nội dung gốc để không làm bẩn dữ liệu seed cho các lần chạy sau.
  // Cast vì Prisma phân biệt "null JS thường" với sentinel JsonNull cho cột Json,
  // trong khi hero/features/pricing/faq đọc lên ở đây chắc chắn không phải null (luôn
  // là object/array) — riêng pricingColumns (Json? nullable) cần map null -> JsonNull.
  await prisma.category.update({
    where: { slug: TEST_SLUG },
    data: {
      ...(originalContent as Prisma.CategoryUpdateInput),
      pricingColumns: originalContent.pricingColumns ?? Prisma.JsonNull,
    },
  });
  await prisma.$disconnect();
});

describe("GET /api/categories/:slug (public)", () => {
  it("trả về nội dung category tồn tại", async () => {
    const response = await fetch(`${BASE_URL}/api/categories/${TEST_SLUG}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.slug).toBe(TEST_SLUG);
    expect(data.hero).toBeDefined();
  });

  it("trả về 404 cho slug không tồn tại", async () => {
    const response = await fetch(`${BASE_URL}/api/categories/khong-ton-tai`);
    expect(response.status).toBe(404);
  });
});

describe("GET/PUT /api/admin/categories/:slug", () => {
  it("chặn khi chưa đăng nhập", async () => {
    const getResponse = await fetch(`${BASE_URL}/api/admin/categories/${TEST_SLUG}`);
    expect(getResponse.status).toBe(401);

    const putResponse = await fetch(`${BASE_URL}/api/admin/categories/${TEST_SLUG}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(putResponse.status).toBe(401);
  });

  it("cập nhật nội dung, set updatedBy từ JWT, và public GET phản ánh ngay", async () => {
    const newContent = {
      hero: {
        title: "Test Title Automation",
        description: "Mô tả test tự động",
        bannerUrl: "/test-banner.svg",
      },
      features: [{ title: "Tính năng test", description: "Mô tả tính năng test" }],
      pricing: [{ planName: "Gói test", price: "0đ", description: "Mô tả gói test" }],
      faq: [{ question: "Câu hỏi test?", answer: "Câu trả lời test" }],
      illustrationUrl: null,
      showFeatures: true,
      showFaq: true,
      pricingLayout: "cards" as const,
      pricingColumns: null,
    };

    const start = performance.now();
    const response = await fetch(`${BASE_URL}/api/admin/categories/${TEST_SLUG}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify(newContent),
    });
    const elapsedMs = performance.now() - start;

    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.updatedBy).toBe("admin@vnpt.vn");
    expect(updated.hero.title).toBe("Test Title Automation");
    expect(elapsedMs).toBeLessThan(500);

    const publicResponse = await fetch(`${BASE_URL}/api/categories/${TEST_SLUG}`);
    const publicData = await publicResponse.json();
    expect(publicData.hero.title).toBe("Test Title Automation");
    expect(publicData.features).toHaveLength(1);
  });

  it("từ chối payload thiếu field bắt buộc", async () => {
    const response = await fetch(`${BASE_URL}/api/admin/categories/${TEST_SLUG}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ hero: { title: "" } }),
    });
    expect(response.status).toBe(400);
  });

  it("trả về 404 khi cập nhật category không tồn tại", async () => {
    const response = await fetch(`${BASE_URL}/api/admin/categories/khong-ton-tai`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        hero: { title: "a", description: "b", bannerUrl: "c" },
        features: [],
        pricing: [],
        faq: [],
        illustrationUrl: null,
        showFeatures: true,
        showFaq: true,
        pricingLayout: "cards",
        pricingColumns: null,
      }),
    });
    expect(response.status).toBe(404);
  });
});

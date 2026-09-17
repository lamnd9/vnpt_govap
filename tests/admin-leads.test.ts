import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { BASE_URL } from "./setup/global-setup";

const prisma = new PrismaClient();
const createdLeadIds: string[] = [];
let adminCookie: string;

let phoneCounter = 0;
function uniquePhone(): string {
  phoneCounter += 1;
  return "0" + String(930000000 + phoneCounter);
}

async function createTestLead(note: string | null = "Ghi chú ban đầu") {
  const lead = await prisma.lead.create({
    data: {
      fullName: "Test Admin Leads",
      phone: uniquePhone(),
      categorySlug: "chu-ky-so",
      note,
    },
  });
  createdLeadIds.push(lead.id);
  return lead;
}

beforeAll(async () => {
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@vnpt.vn", password: "Admin@123" }),
  });
  adminCookie = loginResponse.headers.get("set-cookie")!.split(";")[0];
});

afterAll(async () => {
  if (createdLeadIds.length > 0) {
    await prisma.lead.deleteMany({ where: { id: { in: createdLeadIds } } });
  }
  await prisma.$disconnect();
});

describe("GET /api/admin/leads/:id", () => {
  it("trả về đúng thông tin lead", async () => {
    const lead = await createTestLead();
    const response = await fetch(`${BASE_URL}/api/admin/leads/${lead.id}`, {
      headers: { Cookie: adminCookie },
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(lead.id);
    expect(data.fullName).toBe("Test Admin Leads");
  });

  it("trả về 404 cho id không tồn tại", async () => {
    const response = await fetch(`${BASE_URL}/api/admin/leads/khong-ton-tai`, {
      headers: { Cookie: adminCookie },
    });
    expect(response.status).toBe(404);
  });
});

describe("PATCH /api/admin/leads/:id", () => {
  it("cập nhật trạng thái", async () => {
    const lead = await createTestLead();
    const response = await fetch(`${BASE_URL}/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "contacting" }),
    });
    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.status).toBe("contacting");
  });

  it("xoá ghi chú khi gửi note rỗng (không được giữ nguyên note cũ)", async () => {
    const lead = await createTestLead("Ghi chú cần bị xoá");
    const response = await fetch(`${BASE_URL}/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "new", note: "" }),
    });
    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.note).toBeNull();

    const fromDb = await prisma.lead.findUnique({ where: { id: lead.id } });
    expect(fromDb?.note).toBeNull();
  });

  it("giữ nguyên note khi không gửi field note trong body", async () => {
    const lead = await createTestLead("Note không được đổi");
    const response = await fetch(`${BASE_URL}/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "won" }),
    });
    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.note).toBe("Note không được đổi");
  });

  it("từ chối status không hợp lệ", async () => {
    const lead = await createTestLead();
    const response = await fetch(`${BASE_URL}/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "invalid-status" }),
    });
    expect(response.status).toBe(400);
  });

  it("trả về 404 khi cập nhật id không tồn tại", async () => {
    const response = await fetch(`${BASE_URL}/api/admin/leads/khong-ton-tai`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ status: "won" }),
    });
    expect(response.status).toBe(404);
  });

  it("chặn khi chưa đăng nhập", async () => {
    const lead = await createTestLead();
    const response = await fetch(`${BASE_URL}/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "won" }),
    });
    expect(response.status).toBe(401);
  });
});

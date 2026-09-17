import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import http from "node:http";
import { PrismaClient } from "@prisma/client";
import { BASE_URL, ZALO_MOCK_PORT } from "./setup/global-setup";

const prisma = new PrismaClient();
const CLIENT_IP = `test-leads-${Math.random().toString(36).slice(2)}`;
const createdLeadIds: string[] = [];

let phoneCounter = 0;
function uniquePhone(): string {
  phoneCounter += 1;
  return "0" + String(920000000 + phoneCounter);
}

let mockServer: http.Server;
let receivedWebhookCalls: Array<{ event: string; lead: Record<string, unknown> }> = [];

// Route handler POST /api/leads gọi Zalo qua next/server `after()` (chạy SAU khi đã trả
// response, để không làm chậm submit form — mục 3.1 SRS), nên webhook có thể đến muộn
// hơn vài ms so với lúc fetch() resolve; dùng waitForWebhookCall để poll thay vì assert
// ngay lập tức.
async function waitForWebhookCall(timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (receivedWebhookCalls.length === 0) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("Không nhận được lời gọi webhook Zalo trong thời gian chờ.");
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

beforeAll(async () => {
  mockServer = http.createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      receivedWebhookCalls.push(JSON.parse(body));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    });
  });
  await new Promise<void>((resolve) => mockServer.listen(ZALO_MOCK_PORT, resolve));
});

afterEach(() => {
  receivedWebhookCalls = [];
});

afterAll(async () => {
  await new Promise<void>((resolve) => mockServer.close(() => resolve()));
  if (createdLeadIds.length > 0) {
    await prisma.lead.deleteMany({ where: { id: { in: createdLeadIds } } });
  }
  await prisma.$disconnect();
});

describe("POST /api/leads", () => {
  it("lưu lead hợp lệ, gọi webhook Zalo đúng payload, phản hồi dưới 500ms", async () => {
    const payload = {
      fullName: "Nguyễn Văn Test",
      phone: uniquePhone(),
      email: "test@example.com",
      categorySlug: "chu-ky-so",
      note: "Test tự động",
    };

    const start = performance.now();
    const response = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": CLIENT_IP },
      body: JSON.stringify(payload),
    });
    const elapsedMs = performance.now() - start;

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBeTruthy();
    createdLeadIds.push(data.id);

    // Mục 3.1 SRS: API submit form phải phản hồi dưới 500ms.
    expect(elapsedMs).toBeLessThan(500);

    await waitForWebhookCall();
    expect(receivedWebhookCalls).toHaveLength(1);
    expect(receivedWebhookCalls[0].event).toBe("lead.created");
    expect(receivedWebhookCalls[0].lead.phone).toBe(payload.phone);
    expect(receivedWebhookCalls[0].lead.categorySlug).toBe("chu-ky-so");

    const savedLead = await prisma.lead.findUnique({ where: { id: data.id } });
    expect(savedLead?.status).toBe("new");
    expect(savedLead?.fullName).toBe(payload.fullName);
  });

  it("từ chối dữ liệu không hợp lệ (thiếu tên, sai định dạng SĐT, thiếu category)", async () => {
    const response = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": CLIENT_IP },
      body: JSON.stringify({ fullName: "", phone: "123", categorySlug: "" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.fieldErrors.fullName).toBeDefined();
    expect(data.fieldErrors.phone).toBeDefined();
    expect(data.fieldErrors.categorySlug).toBeDefined();
    expect(receivedWebhookCalls).toHaveLength(0);
  });

  it("từ chối email sai định dạng", async () => {
    const response = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": CLIENT_IP },
      body: JSON.stringify({
        fullName: "X",
        phone: uniquePhone(),
        categorySlug: "chu-ky-so",
        email: "not-an-email",
      }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.fieldErrors.email).toBeDefined();
  });

  it("từ chối categorySlug không tồn tại trong DB", async () => {
    const response = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": CLIENT_IP },
      body: JSON.stringify({
        fullName: "X",
        phone: uniquePhone(),
        categorySlug: "khong-ton-tai",
      }),
    });
    expect(response.status).toBe(400);
    expect(receivedWebhookCalls).toHaveLength(0);
  });

  it("chặn spam vượt quá rate-limit 5 request/phút/IP", async () => {
    const ip = `test-ratelimit-${Math.random().toString(36).slice(2)}`;
    const statuses: number[] = [];

    for (let i = 0; i < 6; i += 1) {
      const response = await fetch(`${BASE_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
        body: JSON.stringify({
          fullName: "Rate Test",
          phone: uniquePhone(),
          categorySlug: "chu-ky-so",
        }),
      });
      statuses.push(response.status);
      if (response.status === 201) {
        const data = await response.json();
        createdLeadIds.push(data.id);
      }
    }

    expect(statuses.filter((s) => s === 201)).toHaveLength(5);
    expect(statuses.filter((s) => s === 429)).toHaveLength(1);
  });
});

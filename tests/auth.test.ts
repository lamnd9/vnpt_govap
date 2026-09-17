import { describe, it, expect } from "vitest";
import { BASE_URL } from "./setup/global-setup";

const ADMIN_EMAIL = "admin@vnpt.vn";
const ADMIN_PASSWORD = "Admin@123";

async function login(email: string, password: string) {
  return fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

describe("POST /api/auth/login", () => {
  it("đăng nhập đúng thông tin trả về JWT trong HTTP-only cookie", async () => {
    const response = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("vnpt_admin_token=");
    expect(setCookie).toContain("HttpOnly");
  });

  it("sai mật khẩu trả về 401", async () => {
    const response = await login(ADMIN_EMAIL, "sai-mat-khau");
    expect(response.status).toBe(401);
  });

  it("email không tồn tại trả về 401 (không lộ thông tin tài khoản)", async () => {
    const wrongEmailResponse = await login("khong-ton-tai@vnpt.vn", "bat-ky");
    const wrongPasswordResponse = await login(ADMIN_EMAIL, "bat-ky");
    const wrongEmailBody = await wrongEmailResponse.json();
    const wrongPasswordBody = await wrongPasswordResponse.json();

    expect(wrongEmailResponse.status).toBe(401);
    expect(wrongEmailBody.error).toBe(wrongPasswordBody.error);
  });
});

describe("Middleware xác thực /api/admin/* (proxy.ts, mục 5 TDD)", () => {
  it("chặn truy cập khi chưa đăng nhập", async () => {
    const response = await fetch(`${BASE_URL}/api/admin/leads`);
    expect(response.status).toBe(401);
  });

  it("cho phép truy cập với cookie JWT hợp lệ", async () => {
    const loginResponse = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    const cookie = loginResponse.headers.get("set-cookie")!.split(";")[0];

    const response = await fetch(`${BASE_URL}/api/admin/leads`, {
      headers: { Cookie: cookie },
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("leads");
    expect(data).toHaveProperty("total");
  });

  it("từ chối cookie không hợp lệ/giả mạo", async () => {
    const response = await fetch(`${BASE_URL}/api/admin/leads`, {
      headers: { Cookie: "vnpt_admin_token=gia-mao-khong-hop-le" },
    });
    expect(response.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("vẫn xoá được cookie khi chưa đăng nhập / JWT hết hạn (idempotent)", async () => {
    // Logout phải luôn thực hiện được, kể cả khi không có session hợp lệ — nếu không,
    // một phiên đã hết hạn sẽ không bao giờ tự xoá được cookie cũ phía client.
    const response = await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST" });
    expect(response.status).toBe(200);
  });

  it("xoá cookie khi đã đăng nhập", async () => {
    const loginResponse = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    const cookie = loginResponse.headers.get("set-cookie")!.split(";")[0];

    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("vnpt_admin_token=;");
  });
});

import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";

// Vitest chạy ngoài Next.js nên không tự đọc .env.local — nạp thủ công, .env.local ghi đè .env
// (giống thứ tự Next.js dùng). `quiet` để tắt log quảng cáo mặc định của dotenv.
loadEnv({ path: ".env", quiet: true });
loadEnv({ path: ".env.local", override: true, quiet: true });

export const TEST_PORT = 3100;
export const ZALO_MOCK_PORT = 4123;
export const BASE_URL = `http://localhost:${TEST_PORT}`;

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new Error(`Next.js test server không phản hồi sau ${timeoutMs}ms tại ${url}`);
}

export default async function globalSetup() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    throw new Error(
      "Không kết nối được PostgreSQL cho test. Chạy `docker compose up -d && npx prisma migrate dev && npx prisma db seed` trước khi `npm test`.",
    );
  } finally {
    await prisma.$disconnect();
  }

  const nextBin = path.join(process.cwd(), "node_modules", ".bin", "next");
  const server: ChildProcess = spawn(nextBin, ["start", "-p", String(TEST_PORT)], {
    env: {
      ...process.env,
      // Trỏ về mock server mà từng test file tự khởi động khi cần assert lời gọi webhook.
      LEAD_NOTIFY_ZALO_WEBHOOK_URL: `http://127.0.0.1:${ZALO_MOCK_PORT}/webhook`,
      ZALO_OA_ACCESS_TOKEN: "test-zalo-token",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  server.stderr?.on("data", (chunk: Buffer) => {
    const text = chunk.toString();
    if (text.toLowerCase().includes("error")) process.stderr.write(text);
  });

  await waitForServer(BASE_URL, 60_000);

  return async () => {
    server.kill();
  };
}

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["./tests/setup/global-setup.ts"],
    testTimeout: 15_000,
    hookTimeout: 60_000,
    // Các test file dùng chung 1 server Next.js + 1 DB dev, không chạy song song để
    // tránh đụng độ dữ liệu (đặc biệt là test content editor mutate rồi restore).
    fileParallelism: false,
  },
});

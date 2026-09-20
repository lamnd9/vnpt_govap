import { prisma } from "@/lib/prisma";

export const SITE_SETTINGS_ID = "main";

// Fallback phòng khi row "main" vì lý do gì đó chưa tồn tại (seed chưa chạy) — không để
// trang public crash chỉ vì thiếu cấu hình liên hệ.
const FALLBACK_SETTINGS = {
  email: "toannm.hcm@vnpt.vn",
  phone: "0941048085",
  messengerUrl: "https://www.facebook.com/messages/t/duylam87",
  zaloUrl: "https://zalo.me/0941048085",
};

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: SITE_SETTINGS_ID } });
  return settings ?? { id: SITE_SETTINGS_ID, ...FALLBACK_SETTINGS };
}

type LeadNotificationPayload = {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  categorySlug: string;
  note?: string | null;
  createdAt: Date;
};

const ZALO_WEBHOOK_TIMEOUT_MS = 5000;

// Gửi thông báo lead mới tới nhân viên phụ trách qua Zalo OA (mục 7.1 TDD).
// Lỗi ở bước này không được làm fail request submit lead (lead đã lưu DB thành công).
export async function notifyZaloNewLead(lead: LeadNotificationPayload): Promise<void> {
  const webhookUrl = process.env.LEAD_NOTIFY_ZALO_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[zalo] LEAD_NOTIFY_ZALO_WEBHOOK_URL chưa cấu hình, bỏ qua gửi thông báo lead.");
    return;
  }

  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ZALO_WEBHOOK_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        event: "lead.created",
        lead: {
          id: lead.id,
          fullName: lead.fullName,
          phone: lead.phone,
          email: lead.email ?? null,
          categorySlug: lead.categorySlug,
          note: lead.note ?? null,
          createdAt: lead.createdAt.toISOString(),
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(`[zalo] Webhook trả về lỗi HTTP ${response.status}`);
    }
  } catch (error) {
    console.error("[zalo] Gửi thông báo lead thất bại:", error);
  } finally {
    clearTimeout(timeout);
  }
}

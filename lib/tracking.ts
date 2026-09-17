declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

// Bắn event Lead tới GTM (dataLayer) và Facebook Pixel sau khi submit form thành công
// (mục 7.1 TDD, mục 2.4 SRS).
export function trackLeadSubmit(categorySlug: string): void {
  if (typeof window === "undefined") return;

  window.dataLayer?.push({
    event: "lead_submit",
    category_slug: categorySlug,
  });

  window.fbq?.("track", "Lead", { content_name: categorySlug });
}

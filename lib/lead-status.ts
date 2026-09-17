import { LEAD_STATUSES } from "@/lib/validation";

// Nhãn hiển thị tiếng Việt cho trạng thái lead (mục 2.3 / 4.5 / 4.6 SRS).
export const LEAD_STATUS_LABELS: Record<(typeof LEAD_STATUSES)[number], string> = {
  new: "Mới",
  contacting: "Đang liên hệ",
  won: "Đã chốt",
  lost: "Không tiềm năng",
};

export const LEAD_STATUS_OPTIONS = LEAD_STATUSES.map((value) => ({
  value,
  label: LEAD_STATUS_LABELS[value],
}));

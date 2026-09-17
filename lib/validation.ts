import { z } from "zod";

// Chuẩn hoá chuỗi rỗng thành undefined cho các field không bắt buộc (mục 4.3 SRS).
const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

// Số điện thoại 10 số, vd: 0912345678 (mục 4.3 SRS).
const phoneSchema = z.string().trim().regex(/^0\d{9}$/, "Số điện thoại phải gồm 10 số, bắt đầu bằng 0.");

export const leadInputSchema = z.object({
  fullName: z.string().trim().min(1, "Họ và tên là bắt buộc.").max(100),
  phone: phoneSchema,
  email: z
    .union([z.email("Email không hợp lệ."), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  categorySlug: z.string().trim().min(1, "Sản phẩm quan tâm là bắt buộc."),
  note: optionalTrimmed(2000),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const loginInputSchema = z.object({
  email: z.email("Email không hợp lệ."),
  password: z.string().min(1, "Mật khẩu là bắt buộc."),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const LEAD_STATUSES = ["new", "contacting", "won", "lost"] as const;

// Khác với optionalTrimmed (dùng cho tạo mới lead, chuỗi rỗng = "không nhập"), ở đây
// admin luôn gửi kèm note hiện tại khi lưu — chuỗi rỗng nghĩa là "xoá ghi chú" (phải map
// thành null để Prisma cập nhật, không phải undefined vì Prisma coi undefined = giữ nguyên).
const clearableNote = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((value) => (value === undefined ? undefined : value === "" ? null : value));

export const leadUpdateSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    note: clearableNote,
  })
  .refine((data) => data.status !== undefined || data.note !== undefined, {
    message: "Cần cung cấp status hoặc note để cập nhật.",
  });

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

const featureSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

const pricingPlanSchema = z.object({
  planName: z.string().trim().min(1),
  price: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

const faqItemSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

export const categoryContentSchema = z.object({
  hero: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    bannerUrl: z.string().trim().min(1),
  }),
  features: z.array(featureSchema),
  pricing: z.array(pricingPlanSchema),
  faq: z.array(faqItemSchema),
});

export type CategoryContentInput = z.infer<typeof categoryContentSchema>;

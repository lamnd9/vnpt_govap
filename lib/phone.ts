// Số điện thoại lưu trong DB ở dạng số thuần "0941048085" (10 số, khớp phoneSchema).
// Hiển thị UI theo nhóm 4-3-3 quen thuộc (0941.048.085); href "tel:" giữ nguyên số thuần.
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
}

export function phoneToTelHref(phone: string): string {
  return `tel:${phone.replace(/\D/g, "")}`;
}

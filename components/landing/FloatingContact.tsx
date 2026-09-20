import Image from "next/image";

const CONTACT_HOTLINE = "0941.048.085";
const CONTACT_HOTLINE_TEL = "0941048085";
const CONTACT_ZALO_URL = "https://zalo.me/0941048085";
const CONTACT_MESSENGER_URL = "https://www.facebook.com/messages/t/duylam87";

const quickLinks = [
  {
    title: "Đăng ký Online",
    subtitle: "24/24",
    href: "#dang-ky-tu-van",
    external: false,
    iconBg: "bg-red-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h1M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
      </svg>
    ),
  },
  {
    title: "Chat Messenger",
    subtitle: "0h - 23h59",
    href: CONTACT_MESSENGER_URL,
    external: true,
    iconBg: "bg-[#0084FF]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.13 2 11.5c0 2.9 1.31 5.5 3.4 7.28V22l3.11-1.71c.83.23 1.71.35 2.49.35 5.52 0 10-4.13 10-9.14C21 6.13 17.52 2 12 2zm1.02 12.3-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.92-2.72-5.48 5.82z" />
      </svg>
    ),
  },
  {
    title: "Chat Zalo",
    subtitle: "0h00 - 23h59",
    href: CONTACT_ZALO_URL,
    external: true,
    iconBg: "bg-white ring-1 ring-slate-200",
    icon: (
      <Image src="/images/icons/zalo.png" alt="Zalo" width={64} height={64} className="h-7 w-7 object-contain" />
    ),
  },
];

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-56 flex-col gap-2 sm:bottom-6 sm:right-6">
      {quickLinks.map((link) => (
        <a
          key={link.title}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl"
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${link.iconBg}`}>
            {link.icon}
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-slate-900">{link.title}</span>
            <span className="block text-xs text-slate-500">{link.subtitle}</span>
          </span>
        </a>
      ))}
      <a
        href={`tel:${CONTACT_HOTLINE_TEL}`}
        className="flex items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-800"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
        </svg>
        {CONTACT_HOTLINE}
      </a>
    </div>
  );
}

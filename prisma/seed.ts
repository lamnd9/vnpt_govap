import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type CategorySeed = {
  slug: string;
  name: string;
  hero: { title: string; description: string; bannerUrl: string };
  pricing: { planName: string; price: string; description: string }[];
  illustrationUrl: string | null;
  pricingLayout: "cards" | "table";
  pricingColumns: { plan: string; middle: string; price: string } | null;
};

const categories: CategorySeed[] = [
  {
    slug: "chu-ky-so",
    name: "Chữ ký số",
    hero: {
      title: "Chữ ký số VNPT",
      description:
        "Giải pháp ký số điện tử hợp pháp, nhanh chóng cho cá nhân và doanh nghiệp.",
      bannerUrl: "/images/categories/chu-ky-so/banner.svg",
    },
    pricing: [
      {
        planName: "Chữ ký số VNPT 1 Năm tặng 6 tháng",
        price: "1.296.000(VND)",
        description: "6 tháng",
      },
      {
        planName: "Chữ ký số VNPT 2 Năm tặng 9 tháng",
        price: "2.116.800(VND)",
        description: "9 tháng",
      },
      {
        planName: "Chữ ký số VNPT 3 Năm tặng 12 tháng",
        price: "2.484.000(VND)",
        description: "12 tháng",
      },
    ],
    illustrationUrl: "/images/categories/chu-ky-so/illustration.webp",
    pricingLayout: "table",
    pricingColumns: null,
  },
  {
    slug: "hoa-don-dien-tu",
    name: "Hóa đơn điện tử",
    hero: {
      title: "Hóa đơn điện tử VNPT Invoice",
      description: "Giải pháp phát hành, quản lý hóa đơn điện tử đáp ứng quy định của cơ quan thuế.",
      bannerUrl: "/images/categories/hoa-don-dien-tu/banner.svg",
    },
    pricing: [
      { planName: "2000 Hóa đơn điện tử", price: "1.404.000(VND)", description: "2300 hóa đơn" },
      { planName: "1000 Hóa đơn điện tử", price: "940.680(VND)", description: "500 hóa đơn" },
      { planName: "500 Hóa đơn điện tử", price: "589.680(VND)", description: "300 hóa đơn" },
    ],
    illustrationUrl: "/images/categories/hoa-don-dien-tu/illustration.webp",
    pricingLayout: "table",
    pricingColumns: { plan: "Tên gói cước", middle: "Số lượng hóa đơn", price: "Đơn giá(VND)" },
  },
  {
    slug: "phan-mem-cho-doanh-nghiep",
    name: "Phần mềm cho doanh nghiệp",
    hero: {
      title: "Bộ giải pháp phần mềm cho doanh nghiệp",
      description: "Các phần mềm quản trị giúp doanh nghiệp vận hành hiệu quả, chuyển đổi số toàn diện.",
      bannerUrl: "/images/categories/phan-mem-cho-doanh-nghiep/banner.svg",
    },
    pricing: [
      { planName: "Gói Starter", price: "3.600.000(VND)", description: "12 tháng" },
      { planName: "Gói Business", price: "7.200.000(VND)", description: "12 tháng" },
      { planName: "Gói Enterprise", price: "15.000.000(VND)", description: "12 tháng" },
    ],
    illustrationUrl: "/images/categories/phan-mem-cho-doanh-nghiep/illustration.svg",
    pricingLayout: "table",
    pricingColumns: null,
  },
  {
    slug: "phan-mem-cho-ho-kinh-doanh",
    name: "Phần mềm cho hộ kinh doanh",
    hero: {
      title: "Giải pháp số cho hộ kinh doanh",
      description: "Công cụ quản lý bán hàng, thu chi đơn giản, dễ sử dụng dành cho hộ kinh doanh.",
      bannerUrl: "/images/categories/phan-mem-cho-ho-kinh-doanh/banner.svg",
    },
    pricing: [
      { planName: "Gói Cơ bản", price: "1.200.000(VND)", description: "12 tháng" },
      { planName: "Gói Tiêu chuẩn", price: "2.400.000(VND)", description: "12 tháng" },
      { planName: "Gói Nâng cao", price: "3.600.000(VND)", description: "12 tháng" },
    ],
    illustrationUrl: "/images/categories/phan-mem-cho-ho-kinh-doanh/illustration.svg",
    pricingLayout: "table",
    pricingColumns: null,
  },
  {
    slug: "giai-phap-cho-khoi-chinh-quyen",
    name: "Giải pháp cho khối chính quyền",
    hero: {
      title: "Giải pháp chuyển đổi số cho khối chính quyền",
      description: "Nền tảng hỗ trợ chính quyền các cấp số hóa quy trình, nâng cao hiệu quả phục vụ người dân.",
      bannerUrl: "/images/categories/giai-phap-cho-khoi-chinh-quyen/banner.svg",
    },
    pricing: [
      { planName: "Gói Xã/Phường", price: "8.000.000(VND)", description: "12 tháng" },
      { planName: "Gói Quận/Huyện", price: "20.000.000(VND)", description: "12 tháng" },
      { planName: "Gói Tỉnh/Thành", price: "50.000.000(VND)", description: "12 tháng" },
    ],
    illustrationUrl: "/images/categories/giai-phap-cho-khoi-chinh-quyen/illustration.svg",
    pricingLayout: "table",
    pricingColumns: null,
  },
  {
    slug: "giai-phap-cho-truong-hoc",
    name: "Giải pháp cho trường học",
    hero: {
      title: "Giải pháp chuyển đổi số cho trường học",
      description: "Nền tảng quản lý giáo dục hỗ trợ nhà trường, giáo viên, phụ huynh kết nối hiệu quả.",
      bannerUrl: "/images/categories/giai-phap-cho-truong-hoc/banner.svg",
    },
    pricing: [
      { planName: "Gói dưới 500 học sinh", price: "6.000.000(VND)", description: "1 năm học" },
      { planName: "Gói 500 - 2.000 học sinh", price: "15.000.000(VND)", description: "1 năm học" },
      { planName: "Gói trên 2.000 học sinh", price: "30.000.000(VND)", description: "1 năm học" },
    ],
    illustrationUrl: "/images/categories/giai-phap-cho-truong-hoc/illustration.svg",
    pricingLayout: "table",
    pricingColumns: null,
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        hero: category.hero,
        pricing: category.pricing,
        illustrationUrl: category.illustrationUrl,
        pricingLayout: category.pricingLayout,
        pricingColumns: category.pricingColumns ?? Prisma.JsonNull,
      },
      create: { ...category, pricingColumns: category.pricingColumns ?? Prisma.JsonNull },
    });
  }

  const adminEmail = "admin@vnpt.vn";
  const adminPasswordHash = await bcrypt.hash("Admin@123", 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: adminPasswordHash },
  });

  // Cấu hình liên hệ chung dùng cho header/footer/floating-contact trang public — giữ đúng
  // giá trị đang hardcode hiện tại để không bị mất khi chuyển sang quản lý qua Admin.
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      email: "toannm.hcm@vnpt.vn",
      phone: "0941048085",
      address: "57 Huỳnh Thúc Kháng, Hà Nội",
      messengerUrl: "https://www.facebook.com/messages/t/duylam87",
      zaloUrl: "https://zalo.me/0941048085",
    },
  });

  console.log(`Seeded ${categories.length} categories, 1 tài khoản admin (${adminEmail}) và cấu hình liên hệ chung.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

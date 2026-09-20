import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type CategorySeed = {
  slug: string;
  name: string;
  hero: { title: string; description: string; bannerUrl: string };
  features: { title: string; description: string }[];
  pricing: { planName: string; price: string; description: string }[];
  faq: { question: string; answer: string }[];
  illustrationUrl: string | null;
  showFeatures: boolean;
  showFaq: boolean;
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
    features: [
      { title: "Ký số mọi lúc mọi nơi", description: "Ký hợp đồng, hóa đơn ngay trên thiết bị di động." },
      { title: "Bảo mật cao", description: "Tuân thủ tiêu chuẩn pháp lý về chữ ký số tại Việt Nam." },
    ],
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
    faq: [
      { question: "Chữ ký số VNPT có giá trị pháp lý không?", answer: "Có, tuân thủ quy định pháp luật Việt Nam về giao dịch điện tử." },
    ],
    illustrationUrl: "/images/categories/chu-ky-so/illustration.webp",
    showFeatures: false,
    showFaq: false,
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
    features: [
      { title: "Kết nối trực tiếp cơ quan thuế", description: "Tự động gửi dữ liệu hóa đơn theo quy định." },
      { title: "Quản lý tập trung", description: "Theo dõi, tra cứu hóa đơn mọi lúc trên một nền tảng." },
    ],
    pricing: [
      { planName: "2000 Hóa đơn điện tử", price: "1.404.000(VND)", description: "2300 hóa đơn" },
      { planName: "1000 Hóa đơn điện tử", price: "940.680(VND)", description: "500 hóa đơn" },
      { planName: "500 Hóa đơn điện tử", price: "589.680(VND)", description: "300 hóa đơn" },
    ],
    faq: [
      { question: "Hóa đơn điện tử có cần đăng ký với cơ quan thuế không?", answer: "Có, VNPT hỗ trợ đăng ký và kết nối trong quá trình triển khai." },
    ],
    illustrationUrl: "/images/categories/hoa-don-dien-tu/illustration.webp",
    showFeatures: false,
    showFaq: false,
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
    features: [
      { title: "Quản lý nhân sự - kế toán", description: "Tích hợp các nghiệp vụ quản trị cốt lõi." },
      { title: "Báo cáo thời gian thực", description: "Dashboard trực quan hỗ trợ ra quyết định nhanh." },
    ],
    pricing: [
      { planName: "Gói Starter", price: "3.600.000(VND)", description: "12 tháng" },
      { planName: "Gói Business", price: "7.200.000(VND)", description: "12 tháng" },
      { planName: "Gói Enterprise", price: "15.000.000(VND)", description: "12 tháng" },
    ],
    faq: [
      { question: "Phần mềm có tích hợp được với hệ thống hiện tại không?", answer: "Có, hỗ trợ tích hợp qua API theo yêu cầu triển khai." },
    ],
    illustrationUrl: "/images/categories/phan-mem-cho-doanh-nghiep/illustration.svg",
    showFeatures: false,
    showFaq: false,
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
    features: [
      { title: "Quản lý bán hàng đơn giản", description: "Giao diện dễ dùng, phù hợp hộ kinh doanh cá thể." },
      { title: "Theo dõi thu chi", description: "Ghi nhận doanh thu, chi phí hàng ngày rõ ràng." },
    ],
    pricing: [
      { planName: "Gói Cơ bản", price: "1.200.000(VND)", description: "12 tháng" },
      { planName: "Gói Tiêu chuẩn", price: "2.400.000(VND)", description: "12 tháng" },
      { planName: "Gói Nâng cao", price: "3.600.000(VND)", description: "12 tháng" },
    ],
    faq: [
      { question: "Có cần thiết bị chuyên dụng để sử dụng không?", answer: "Không, chỉ cần điện thoại hoặc máy tính có kết nối Internet." },
    ],
    illustrationUrl: "/images/categories/phan-mem-cho-ho-kinh-doanh/illustration.svg",
    showFeatures: false,
    showFaq: false,
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
    features: [
      { title: "Một cửa điện tử", description: "Số hóa quy trình tiếp nhận, xử lý hồ sơ hành chính." },
      { title: "Báo cáo, thống kê", description: "Tổng hợp dữ liệu phục vụ điều hành, quản lý." },
    ],
    pricing: [
      { planName: "Gói Xã/Phường", price: "8.000.000(VND)", description: "12 tháng" },
      { planName: "Gói Quận/Huyện", price: "20.000.000(VND)", description: "12 tháng" },
      { planName: "Gói Tỉnh/Thành", price: "50.000.000(VND)", description: "12 tháng" },
    ],
    faq: [
      { question: "Giải pháp có đáp ứng quy định về an toàn thông tin không?", answer: "Có, tuân thủ các quy định về an toàn thông tin trong cơ quan nhà nước." },
    ],
    illustrationUrl: "/images/categories/giai-phap-cho-khoi-chinh-quyen/illustration.svg",
    showFeatures: false,
    showFaq: false,
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
    features: [
      { title: "Sổ liên lạc điện tử", description: "Kết nối nhà trường và phụ huynh nhanh chóng." },
      { title: "Quản lý học tập", description: "Theo dõi điểm số, thời khóa biểu tập trung." },
    ],
    pricing: [
      { planName: "Gói dưới 500 học sinh", price: "6.000.000(VND)", description: "1 năm học" },
      { planName: "Gói 500 - 2.000 học sinh", price: "15.000.000(VND)", description: "1 năm học" },
      { planName: "Gói trên 2.000 học sinh", price: "30.000.000(VND)", description: "1 năm học" },
    ],
    faq: [
      { question: "Phụ huynh sử dụng giải pháp như thế nào?", answer: "Phụ huynh sử dụng ứng dụng di động để theo dõi thông tin của con." },
    ],
    illustrationUrl: "/images/categories/giai-phap-cho-truong-hoc/illustration.svg",
    showFeatures: false,
    showFaq: false,
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
        features: category.features,
        pricing: category.pricing,
        faq: category.faq,
        illustrationUrl: category.illustrationUrl,
        showFeatures: category.showFeatures,
        showFaq: category.showFaq,
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

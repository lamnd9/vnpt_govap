import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type CategorySeed = {
  slug: string;
  name: string;
  hero: { title: string; description: string; bannerUrl: string };
  features: { title: string; description: string }[];
  pricing: { planName: string; price: string; description: string }[];
  faq: { question: string; answer: string }[];
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
      { planName: "Gói 1 năm", price: "Liên hệ", description: "Phù hợp cá nhân, hộ kinh doanh nhỏ." },
      { planName: "Gói 2 năm", price: "Liên hệ", description: "Tiết kiệm chi phí cho doanh nghiệp." },
    ],
    faq: [
      { question: "Chữ ký số VNPT có giá trị pháp lý không?", answer: "Có, tuân thủ quy định pháp luật Việt Nam về giao dịch điện tử." },
    ],
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
      { planName: "Gói cơ bản", price: "Liên hệ", description: "Phù hợp hộ kinh doanh, doanh nghiệp nhỏ." },
      { planName: "Gói nâng cao", price: "Liên hệ", description: "Tích hợp API cho doanh nghiệp lớn." },
    ],
    faq: [
      { question: "Hóa đơn điện tử có cần đăng ký với cơ quan thuế không?", answer: "Có, VNPT hỗ trợ đăng ký và kết nối trong quá trình triển khai." },
    ],
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
      { planName: "Gói Starter", price: "Liên hệ", description: "Cho doanh nghiệp mới bắt đầu chuyển đổi số." },
      { planName: "Gói Enterprise", price: "Liên hệ", description: "Tùy chỉnh theo quy mô doanh nghiệp lớn." },
    ],
    faq: [
      { question: "Phần mềm có tích hợp được với hệ thống hiện tại không?", answer: "Có, hỗ trợ tích hợp qua API theo yêu cầu triển khai." },
    ],
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
      { planName: "Gói cơ bản", price: "Liên hệ", description: "Chi phí thấp, phù hợp quy mô nhỏ." },
    ],
    faq: [
      { question: "Có cần thiết bị chuyên dụng để sử dụng không?", answer: "Không, chỉ cần điện thoại hoặc máy tính có kết nối Internet." },
    ],
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
      { planName: "Triển khai theo dự án", price: "Liên hệ", description: "Tư vấn giải pháp phù hợp quy mô đơn vị." },
    ],
    faq: [
      { question: "Giải pháp có đáp ứng quy định về an toàn thông tin không?", answer: "Có, tuân thủ các quy định về an toàn thông tin trong cơ quan nhà nước." },
    ],
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
      { planName: "Gói theo năm học", price: "Liên hệ", description: "Tùy chỉnh theo quy mô trường học." },
    ],
    faq: [
      { question: "Phụ huynh sử dụng giải pháp như thế nào?", answer: "Phụ huynh sử dụng ứng dụng di động để theo dõi thông tin của con." },
    ],
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
      },
      create: category,
    });
  }

  const adminEmail = "admin@vnpt.vn";
  const adminPasswordHash = await bcrypt.hash("Admin@123", 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: adminPasswordHash },
  });

  console.log(`Seeded ${categories.length} categories và 1 tài khoản admin (${adminEmail}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

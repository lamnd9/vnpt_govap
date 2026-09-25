-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "article" TEXT;

-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "address" DROP DEFAULT;

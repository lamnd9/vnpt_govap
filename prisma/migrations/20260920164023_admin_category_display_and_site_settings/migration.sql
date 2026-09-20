-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "illustrationUrl" TEXT,
ADD COLUMN     "pricingColumns" JSONB,
ADD COLUMN     "pricingLayout" TEXT NOT NULL DEFAULT 'cards',
ADD COLUMN     "showFaq" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showFeatures" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "messengerUrl" TEXT NOT NULL,
    "zaloUrl" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

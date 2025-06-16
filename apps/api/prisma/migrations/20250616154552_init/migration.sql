/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `font` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `layoutType` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `themeColor` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_companyId_fkey";

-- DropIndex
DROP INDEX "Company_slug_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "createdAt",
DROP COLUMN "font",
DROP COLUMN "layoutType",
DROP COLUMN "logoUrl",
DROP COLUMN "slug",
DROP COLUMN "themeColor",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "Page";

-- DropTable
DROP TABLE "Product";

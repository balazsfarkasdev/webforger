/*
  Warnings:

  - You are about to drop the `PageSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PageSection" DROP CONSTRAINT "PageSection_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "pageSections" JSONB;

-- DropTable
DROP TABLE "PageSection";

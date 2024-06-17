/*
  Warnings:

  - Added the required column `companyId` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Page_companyId_idx" ON "Page"("companyId");

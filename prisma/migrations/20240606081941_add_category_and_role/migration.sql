-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyCategoryId" TEXT,
ADD COLUMN     "companyRoleId" TEXT;

-- CreateIndex
CREATE INDEX "User_companyCategoryId_idx" ON "User"("companyCategoryId");

-- CreateIndex
CREATE INDEX "User_companyRoleId_idx" ON "User"("companyRoleId");

-- CreateTable
CREATE TABLE "CompanyCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyCategory_companyId_idx" ON "CompanyCategory"("companyId");

-- CreateIndex
CREATE INDEX "CompanyRole_companyId_idx" ON "CompanyRole"("companyId");

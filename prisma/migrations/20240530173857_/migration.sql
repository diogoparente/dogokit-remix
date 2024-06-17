-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "phone" TEXT,
    "fullname" TEXT,
    "nickname" TEXT,
    "companyId" TEXT NOT NULL,
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "links" JSONB,
    "isPrimary" BOOLEAN DEFAULT true,
    "isPublic" BOOLEAN DEFAULT true,
    "modeName" TEXT DEFAULT 'DEFAULT',
    "sequence" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "sequence" INTEGER,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConnection" (
    "id" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageStatus" (
    "id" TEXT NOT NULL,
    "sequence" INTEGER,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PageStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "Password_id_idx" ON "Password"("id");

-- CreateIndex
CREATE INDEX "Password_userId_idx" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_id_userId_key" ON "UserProfile"("id", "userId");

-- CreateIndex
CREATE INDEX "Company_id_idx" ON "Company"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_sequence_key" ON "Role"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "Role_symbol_key" ON "Role"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_symbol_idx" ON "Role"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_entity_access_key" ON "Permission"("action", "entity", "access");

-- CreateIndex
CREATE INDEX "UserConnection_userId_idx" ON "UserConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserConnection_providerId_providerName_key" ON "UserConnection"("providerId", "providerName");

-- CreateIndex
CREATE INDEX "UserImage_userId_idx" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_id_userId_key" ON "UserImage"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Page_slug_idx" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Page_statusId_idx" ON "Page"("statusId");

-- CreateIndex
CREATE INDEX "Page_userId_idx" ON "Page"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PageStatus_sequence_key" ON "PageStatus"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "PageStatus_symbol_key" ON "PageStatus"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "PageStatus_name_key" ON "PageStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

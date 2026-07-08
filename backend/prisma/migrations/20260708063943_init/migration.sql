-- CreateTable
CREATE TABLE "Company" (
    "id" VARCHAR(6) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "actualInvestmentAmount" BIGINT NOT NULL,
    "revenue" BIGINT NOT NULL,
    "employeeCount" INTEGER NOT NULL,
    "myCompanySelectCount" INTEGER NOT NULL DEFAULT 0,
    "compareCompanySelectCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" VARCHAR(6) NOT NULL,
    "companyId" VARCHAR(6) NOT NULL,
    "investorName" VARCHAR(40) NOT NULL,
    "amount" BIGINT NOT NULL,
    "comment" VARCHAR(1000),
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

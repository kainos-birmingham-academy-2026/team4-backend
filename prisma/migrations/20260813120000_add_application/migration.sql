-- CreateTable
CREATE TABLE "Application" (
    "applicationId" SERIAL NOT NULL,
    "jobRoleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("applicationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobRoleId_userId_key" ON "Application"("jobRoleId", "userId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "JobRole"("jobRoleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

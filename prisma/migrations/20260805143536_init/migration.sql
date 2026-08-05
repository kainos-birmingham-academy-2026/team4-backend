-- CreateTable
CREATE TABLE "JobRole" (
    "jobRoleId" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capabilityId" INTEGER NOT NULL,
    "bandId" INTEGER NOT NULL,
    "closingDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "JobRole_pkey" PRIMARY KEY ("jobRoleId")
);

-- CreateTable
CREATE TABLE "Capability" (
    "capabilityId" SERIAL NOT NULL,
    "capabilityName" TEXT NOT NULL,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("capabilityId")
);

-- CreateTable
CREATE TABLE "Band" (
    "bandId" SERIAL NOT NULL,
    "bandName" TEXT NOT NULL,

    CONSTRAINT "Band_pkey" PRIMARY KEY ("bandId")
);

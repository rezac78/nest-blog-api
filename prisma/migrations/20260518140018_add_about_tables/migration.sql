-- CreateTable
CREATE TABLE "About" (
    "id" TEXT NOT NULL,
    "aboutHtml" TEXT NOT NULL,
    "resumeFileBase64" TEXT,
    "resumeLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutJob" (
    "id" TEXT NOT NULL,
    "aboutId" TEXT NOT NULL,
    "position" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL DEFAULT '',
    "companyURL" TEXT,
    "image" TEXT,
    "location" TEXT NOT NULL DEFAULT '',
    "locationType" TEXT NOT NULL DEFAULT '',
    "positionType" TEXT NOT NULL DEFAULT '',
    "startDate" TEXT NOT NULL DEFAULT '',
    "endDate" TEXT DEFAULT '',
    "positionId" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "responsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "AboutJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutEducation" (
    "id" TEXT NOT NULL,
    "aboutId" TEXT NOT NULL,
    "university" TEXT NOT NULL DEFAULT '',
    "major" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "location" TEXT NOT NULL DEFAULT '',
    "degree" TEXT NOT NULL DEFAULT '',
    "startYear" TEXT NOT NULL DEFAULT '',
    "endYear" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AboutEducation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AboutJob_aboutId_idx" ON "AboutJob"("aboutId");

-- CreateIndex
CREATE INDEX "AboutEducation_aboutId_idx" ON "AboutEducation"("aboutId");

-- AddForeignKey
ALTER TABLE "AboutJob" ADD CONSTRAINT "AboutJob_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "About"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutEducation" ADD CONSTRAINT "AboutEducation_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "About"("id") ON DELETE CASCADE ON UPDATE CASCADE;

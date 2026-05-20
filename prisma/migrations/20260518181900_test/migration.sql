/*
  Warnings:

  - You are about to drop the column `nationalCode` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_nationalCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nationalCode",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "githubLink" TEXT,
ADD COLUMN     "jobStatus" TEXT,
ADD COLUMN     "linkedInLink" TEXT,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "whatIveBeenWorkingOn" TEXT,
ALTER COLUMN "mobile" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_firstName_idx" ON "User"("firstName");

-- CreateIndex
CREATE INDEX "User_lastName_idx" ON "User"("lastName");

/*
  Warnings:

  - A unique constraint covering the columns `[refreshTokenId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshTokenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshTokenId_key" ON "User"("refreshTokenId");

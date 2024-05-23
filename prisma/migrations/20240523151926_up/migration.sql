/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `request` table. All the data in the column will be lost.
  - Added the required column `contactNo` to the `request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "request" DROP COLUMN "phoneNumber",
ADD COLUMN     "contactNo" TEXT NOT NULL;

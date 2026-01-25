/*
  Warnings:

  - Added the required column `bookId` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "bookId" TEXT NOT NULL,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "keyTakeaways" TEXT[],
ADD COLUMN     "knowledgeAssessment" TEXT,
ADD COLUMN     "perspectiveInsights" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "coverImage" TEXT,
    "summary" TEXT NOT NULL,
    "keyThemes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

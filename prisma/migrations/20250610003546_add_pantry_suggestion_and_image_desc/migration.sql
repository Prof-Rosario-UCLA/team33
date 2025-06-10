-- AlterTable
ALTER TABLE "PantryItem" ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "PantrySuggestion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "PantrySuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PantrySuggestion_name_key" ON "PantrySuggestion"("name");

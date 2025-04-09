-- CreateTable
CREATE TABLE "Entries" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT NOT NULL,
    "morning_time_in" TEXT NOT NULL,
    "morning_time_out" TEXT NOT NULL,
    "afternoon_time_in" TEXT NOT NULL,
    "afternoon_time_out" TEXT NOT NULL,
    "evening_time_in" TEXT,
    "evening_time_out" TEXT,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Entries_pkey" PRIMARY KEY ("id")
);

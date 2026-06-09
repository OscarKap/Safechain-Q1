-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('New', 'Assigned', 'In_Progress', 'Resolved', 'Closed');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "case_number" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "province" TEXT,
    "district" TEXT,
    "gps_location" TEXT,
    "reporter_name" TEXT,
    "reporter_phone" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'New',
    "priority" TEXT NOT NULL DEFAULT 'Low',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SosAlert" (
    "id" TEXT NOT NULL,
    "report_id" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SosAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportAssignment" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "responder_id" TEXT NOT NULL,
    "assigned_by" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'Assigned',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SosAlert" ADD CONSTRAINT "SosAlert_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAssignment" ADD CONSTRAINT "ReportAssignment_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

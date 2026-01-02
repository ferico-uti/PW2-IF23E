/*
  Warnings:

  - Added the required column `satuan` to the `tb_barang` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Satuan" AS ENUM ('Unit', 'Pcs', 'Kg');

-- AlterTable
ALTER TABLE "public"."tb_barang" ADD COLUMN     "satuan" "public"."Satuan" NOT NULL;

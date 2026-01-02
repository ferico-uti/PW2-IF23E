-- CreateTable
CREATE TABLE "public"."tb_barang" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "harga" INTEGER NOT NULL,

    CONSTRAINT "tb_barang_pkey" PRIMARY KEY ("id")
);

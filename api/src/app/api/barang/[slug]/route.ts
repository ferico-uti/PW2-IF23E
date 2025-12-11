import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

// buat variabel prisma client
const prisma = new PrismaClient();

// buat service DELETE (hapus data)
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  // return NextResponse.json({
  //     slug: params.slug
  // })

  // cek apakah data barang ditemukan
  const check = await prisma.tb_barang.findUnique({
    where: {
      id: Number(params.slug),
    },
  });

  // jika data barang tidak ditemukan
  if (!check) {
    // tampilkan respon
    return NextResponse.json({
      message: "Data Barang Gagal Dihapus ! (Kode Tidak Ada !)",
      success: false,
    });
  }

  // jika data barang ditemukan
  await prisma.tb_barang.delete({
    where: {
      id: Number(params.slug),
    },
  });

  // tampilkan respon
  return NextResponse.json({
    message: "Data Barang Berhasil Dihapus",
    success: true,
  });
};

// buat service PUT (ubah data)
export const PUT = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const data = await request.json();

  // cek apakah data barang ditemukan
  const check = await prisma.tb_barang.findFirst({
    where: {
      kode: data.kode,
      id: {
        not: Number(params.slug),
      },
    },
  });

  // jika data barang ditemukan
  if (check) {
    // tampilkan respon
    return NextResponse.json({
      message: "Data Barang Gagal Diubah ! (Kode Tidak Ada !)",
      success: false,
    });
  }

  // jika data barang tidak ditemukan
  await prisma.tb_barang.update({
    where: {
      id: Number(params.slug),
    },
    data: {
      kode: data.kode,
      nama: data.nama,
      harga: data.harga,
      satuan: data.satuan,
    },
  });

  // tampilkan respon
  return NextResponse.json({
    message: "Data Barang Berhasil Diubah",
    success: true,
  });
};

// buat service GET (detail data)
export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  // cek apakah data barang ditemukan
  const data = await prisma.tb_barang.findUnique({
    where: {
      id: Number(params.slug),
    },
  });

  // jika data barang tidak ditemukan
  if (!data) {
    // tampilkan respon
    return NextResponse.json({
      message: "Data Barang Tidak Ditemukan !)",
      success: false,
    });
  }

  //   jika data barang ditemukan
  return NextResponse.json({
    barang: data,
  });
};

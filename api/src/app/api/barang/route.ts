import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

// buat variabel prisma client
const prisma = new PrismaClient();

// buat fungsi GET (ambil data)
// export async function GET() {
//     // return new Response("Test")
//     return new NextResponse(JSON.stringify({
//         message: "Test API",
//         success: true
//     }))
// }

// arrow function
export const GET = async () => {
    // return new NextResponse(JSON.stringify({
    //     message: "Test API",
    //     success: true
    // }))

    // ambil data dari tb_barang
    const data = await prisma.tb_barang.findMany({
        orderBy: {
            kode: "desc"
        },
        // where: {
        //     kode: "B02"
        // }
    });
    // return new NextResponse(JSON.stringify(data));
    return NextResponse.json({
        barang: data
    });
}

// buat service POST (simpan data)
export const POST = async (request: NextRequest) => {
    // baca data hasil request 
    // ubah dalam format json
    const data = await request.json();

    // cek apakah kode barang sudah pernah ada / belum
    const check = await prisma.tb_barang.findFirst({
        where: {
            kode: data.kode
        },
        select: {
            kode: true
        }
    })

    // jika kode barang ditemukan
    if (check) {
        // tampilkan respon
        return NextResponse.json({
            message: "Data Barang Gagal Disimpan ! (Kode Sudah Ada !)",
            success: false
        })
    }
    // jika kode barang tidak ditemukan
    // else {

    // simpan data sesuai request
    await prisma.tb_barang.create({
        data: {
            kode: data.kode,
            nama: data.nama,
            harga: data.harga,
            satuan: data.satuan
        }
    })

    // tampilkan respon
    return NextResponse.json({
        message: "Data Barang Berhasil Disimpan",
        success: true
    })
    // }


}


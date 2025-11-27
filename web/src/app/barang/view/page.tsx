"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/scripts";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";
import styles from "../barang.module.css";

// buat interface
interface ModelBarang {
  id: number;
  kode: string;
  nama: string;
  harga: number;
  satuan: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ViewBarangPage() {
  //   buat variabel
  // const nama = "TEKNOKRAT";
  // const motto = "Sang Juara";

  const { data, error, isLoading, mutate } = useSWR(
    "http://localhost:3001/api/barang",
    fetcher
  );

  // buat fungsi untuk hapus data
  const deleteData = async (id: number) => {
    const response = await axios.delete(
      `http://localhost:3001/api/barang/${id}`
    );

    // tampilkan hasil response
    // console.log(response.data.message);

    // jika success == true
    if (response.data.success) {
      toast.success(response.data.message);
    }
    // jika success == false
    else {
      toast.error(response.data.message);
    }

    mutate(data);
  };
 
  return (
    <>
      <title>View Data Barang</title>      

      {/* tombol tambah */}
      <nav className="mt-2.5 mx-5 flex md:justify-end sm:justify-start justify-center">
        <Link
          href="/barang/add"
          className="sm:bg-sky-700 bg-rose-700 py-2.5 px-5 rounded-full text-white">
          Tambah Data
        </Link>
      </nav>

      {/* content */}
      <article className={styles.content}>
        {error ? (
          <div className="text-center">Gagal Ambil Data</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[10%]">Aksi</TableHead>
                <TableHead className="text-center w-[10%]">Kode</TableHead>
                <TableHead className="text-center w-auto">Nama</TableHead>
                <TableHead className="text-center w-[15%]">Harga</TableHead>
                <TableHead className="text-center w-[15%]">Satuan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Mohon Tunggu ...
                  </TableCell>
                </TableRow>
              ) : (
                data &&
                data.barang.map((item: ModelBarang) => (
                  
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {/* buat tombol edit */}
                      <button className={styles.btn_edit}>
                        <Pencil size={16} color="#a51c31" />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger className={styles.btn_delete}>
                          <Trash2 size={16} color="#fff" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Konfirmasi Hapus Data Barang
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Nama Barang : {item.nama} Ingin Dihapus ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Tidak</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                deleteData(item.id);
                              }}>
                              Ya
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                    <TableCell className="text-center">{item.kode}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell className="text-right">
                      {formatRupiah(item.harga)}
                    </TableCell>
                    <TableCell className="text-center">{item.satuan}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </article>
    </>
  );
}

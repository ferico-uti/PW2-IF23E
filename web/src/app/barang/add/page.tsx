"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  filterHarga,
  filterHargaRaw,
  filterKode,
  filterNama,
  formatRibuan,
} from "@/lib/scripts";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { useState } from "react";
import styles from "../barang.module.css";
import axios from "axios";
import { toast } from "sonner";
import { API_BARANG } from "@/lib/strings";
import { useRouter } from "next/navigation";

const satuan = [
  {
    value: "Unit",
    label: "Unit",
  },
  {
    value: "Pcs",
    label: "Pcs",
  },
  {
    value: "Kg",
    label: "Kilogram",
  },
];

export default function AddBarangPage() {
  // buat variabel router (untuk navigasi halaman)
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // buat state untuk kode
  const [formKode, setFormKode] = useState("");
  const [formNama, setFormNama] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [formHargaRaw, setFormHargaRaw] = useState(0);

  // buat state untuk cek error (jika ada salah komponen tidak diisi)
  // bentuk state berupa objek  
  const [error, setError] = useState<{
    kode: boolean;
    nama: boolean;
    harga: boolean;
    satuan: boolean;
  }>({
    kode: false,
    nama: false,
    harga: false,
    satuan: false,
  });

  // buat fungsi untuk simpan data
  const saveData = async () => {
    // buat object errorStatus untuk menampung kondisi error setiap komponen
    const errorStatus = {
      kode: formKode === "",
      nama: formNama === "",
      harga: formHarga === "",
      satuan: value === "",
    };

    // update kondisi error setiap komponen
    setError(errorStatus);

    const hasError =
      errorStatus.kode ||
      errorStatus.nama ||
      errorStatus.harga ||
      errorStatus.satuan;

    // jika ada salah satu komponen tidak diisi
    if (hasError) {
      return;
    }

    // jika tidak error (seluruh komponen sudah diisi)
    //  simpan data
    try {
      const response = await axios.post(API_BARANG, {
        kode: formKode,
        nama: formNama,
        harga: formHargaRaw,
        satuan: value,
      });
      // jika success == true
      if (response.data.success) {
        toast.success(response.data.message);

        // kosongkan isi komponen
        setFormKode("");
        setFormNama("");
        setFormHarga("");
        setFormHargaRaw(0);
        setValue("");
      }
      // jika success == false
      else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error(`Gagal Kirim Data !`);
    }
  };

  return (
    <>
      <title>Tambah Data Barang</title>

      <article
        className={`${styles.content} grid sm:grid-cols-2 grid-cols-1 gap-4`}>
        {/* area kode */}
        <section>
          <Label htmlFor="txt_kode" className={styles.label}>
            Kode Barang
          </Label>
          <Input
            type="text"
            id="txt_kode"
            placeholder="Isi Kode Barang"
            maxLength={15}
            value={formKode}
            onChange={(event) => {
              // buat variabel untuk filterKode
              const result = filterKode(event.target.value);
              // simpan data input ke state
              setFormKode(result);
            }}
          />

          {/* tampilkan error jika kode barang belum diisi */}
          {error.kode && (
            <Label className={styles.error}><Info size={14}/> Kode Barang Harus Diisi !</Label>
          )}
        </section>

        {/* area nama */}
        <section>
          <Label htmlFor="txt_nama" className={styles.label}>
            Nama Barang
          </Label>
          <Input
            type="text"
            id="txt_nama"
            placeholder="Isi Nama Barang"
            maxLength={50}
            value={formNama}
            onChange={(event) => {
              // buat variabel untuk filterNama
              const result = filterNama(event.target.value);
              // simpan data input ke state
              setFormNama(result);
            }}
          />

          {/* tampilkan error jika nama barang belum diisi */}
          {error.nama && (
            <Label className={styles.error}><Info size={14}/> Nama Barang Harus Diisi !</Label>
          )}
        </section>

        {/* area harga */}
        <section>
          <Label htmlFor="txt_harga" className={styles.label}>
            Harga Barang
          </Label>
          <Input
            type="text"
            id="txt_harga"
            placeholder="Isi Harga Barang"
            maxLength={11}
            value={formHarga}
            onChange={(event) => {
              // buat variabel untuk filterHarga
              const result = formatRibuan(filterHarga(event.target.value));
              // buat variabel untuk filterHargaRaw
              const resultRaw = filterHargaRaw(event.target.value);
              // simpan data input ke state
              setFormHarga(result);
              setFormHargaRaw(Number(resultRaw));
            }}
          />

          {/* tampilkan error jika harga barang belum diisi */}
          {error.harga && (
            <Label className={styles.error}><Info size={14}/> Harga Barang Harus Diisi !</Label>
          )}
        </section>

        {/* area satuan */}
        <section>
          <Label htmlFor="cbo_satuan" className={styles.label}>
            Satuan Barang
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between">
                {value
                  ? satuan.find((data_satuan) => data_satuan.value === value)
                      ?.label
                  : "Pilih Satuan Barang"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Cari Satuan Barang"
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>Data Tidak Ditemukan !</CommandEmpty>
                  <CommandGroup>
                    {satuan.map((data_satuan) => (
                      <CommandItem
                        key={data_satuan.value}
                        value={data_satuan.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}>
                        {data_satuan.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === data_satuan.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* tampilkan error jika satuan barang belum dipilih */}
          {error.satuan && (
            <Label className={styles.error}>
              <Info size={14}/> Satuan Barang Harus Dipilih !
            </Label>
          )}
        </section>

        {/* area tombol */}
        <section className="flex sm:justify-start justify-center">
          <Button
            className="rounded-full px-2.5 mr-1.5 w-[100px]"
            onClick={saveData}>
            Simpan
          </Button>
          <Button
            variant="secondary"
            className="rounded-full px-2.5 ml-1.5 w-[100px]" onClick={()=>router.back()}>
            Batal
          </Button>
        </section>
      </article>
    </>
  );
}

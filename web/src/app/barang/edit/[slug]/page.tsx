"use client";

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "../../barang.module.css";
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
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    filterHarga,
    filterHargaRaw,
    filterKode,
    filterNama,
    formatRibuan,
    formatRupiah,
} from "@/lib/scripts";
import { API_BARANG } from '@/lib/strings';
import useSWR from 'swr';

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

// buat variabel fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EditBarangPage() {
    // buat hook useParams
    const params = useParams()
    const slug = params.slug;

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

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    // buat variabel router (untuk navigasi halaman)
    const router = useRouter();

    // panggil service detail barang sesuai slug (id)
    const { data } = useSWR(
        `${API_BARANG}/${slug}`,
        fetcher
    );

    // tampilkan detail data ke dalam komponen
    useEffect(() => {
        // jika data tidak ditemukan
        if (!data) return;

        // jika data barang tidak ditemukan
        if (!data.barang) {
            // alihkan ke halaman 404
            router.replace("/404");
            return;
        }

        // jika data barang ditemukan
        const barang = data.barang;

        // tampilkan data ke dalam form
        setFormKode(barang.kode ?? "");
        setFormNama(barang.nama ?? "");
        setFormHarga(formatRupiah(Number(barang.harga)) ?? "");
        setFormHargaRaw(barang.harga ?? 0);
        setValue(barang.satuan);

    }, [data, router])


    return (
        <>
            <title>Edit Data Barang</title>

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
                        <Label className={styles.error}><Info size={14} /> Kode Barang Harus Diisi !</Label>
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
                        <Label className={styles.error}><Info size={14} /> Nama Barang Harus Diisi !</Label>
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
                        <Label className={styles.error}><Info size={14} /> Harga Barang Harus Diisi !</Label>
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
                            <Info size={14} /> Satuan Barang Harus Dipilih !
                        </Label>
                    )}
                </section>

                {/* area tombol */}
                <section className="flex sm:justify-start justify-center">
                    <Button
                        className="rounded-full px-2.5 mr-1.5 w-[100px]">
                        Ubah
                    </Button>
                    <Button
                        variant="secondary"
                        className="rounded-full px-2.5 ml-1.5 w-[100px]" onClick={() => router.back()}>
                        Batal
                    </Button>
                </section>
            </article>
        </>
    )
}

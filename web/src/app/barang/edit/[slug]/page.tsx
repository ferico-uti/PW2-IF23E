"use client";

import CustomButtonPrimary from "@/components/custom/CustomButtonPrimary";
import CustomButtonSecondary from "@/components/custom/CustomButtonSecondary";
import CustomInput from "@/components/custom/CustomInput";
import CustomLabel from "@/components/custom/CustomLabel";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
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
    formatRupiah,
} from "@/lib/scripts";
import { API_BARANG } from '@/lib/strings';
import { cn } from "@/lib/utils";
import axios from 'axios';
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import styles from "../../barang.module.css";

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
    const [errorForm, setErrorForm] = useState<{
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
    const { data, error, isLoading } = useSWR(
        slug ? `${API_BARANG}/${slug}` : null,
        fetcher
    );

    // tampilkan detail data ke dalam komponen
    useEffect(() => {
        // saat loading
        if (isLoading) return;

        // jika request error atau data barang tidak ditemukan
        if (error || !data?.barang) {
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
        setValue(barang.satuan ?? "");

    }, [data, error, isLoading, router]);

    // buat fungsi untuk edit data
    const editData = async () => {
        // buat object errorStatus untuk menampung kondisi error setiap komponen
        const errorStatus = {
            kode: formKode === "",
            nama: formNama === "",
            harga: formHarga === "",
            satuan: value === "",
        };

        // update kondisi error setiap komponen
        setErrorForm(errorStatus);

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
        //  ubah data
        try {
            const response = await axios.put(`${API_BARANG}/${slug}`, {
                kode: formKode,
                nama: formNama,
                harga: formHargaRaw,
                satuan: value,
            });
            // jika success == true
            if (response.data.success) {
                toast.success(response.data.message);

            }
            // jika success == false
            else {
                toast.error(response.data.message);
            }
        } catch {
            toast.error(`Gagal Kirim Data !`);
        }
    }


    return (
        <>
            <title>Edit Data Barang</title>

            <article
                className={`${styles.content} grid sm:grid-cols-2 grid-cols-1 gap-4`}>
                {/* area kode */}
                <section>
                    {/* panggil reusable component CustomLabel 
                        (components/custom/CustomLabel.tsx)
                    */}
                    <CustomLabel htmlFor="txt_kode" required>Kode Barang</CustomLabel>

                    {/* panggil reusable component CustomInput 
                        (components/custom/CustomInput.tsx)
                    */}
                    <CustomInput
                        type="text"
                        id="txt_kode"
                        placeholder="Isi Kode Barang"
                        maxLength={10}
                        value={formKode}
                        onChange={(event) => {
                            // buat variabel untuk filterKode
                            const result = filterKode(event.target.value);
                            // simpan data input ke state
                            setFormKode(result);
                        }}
                    />

                    {/* tampilkan error jika kode barang belum diisi */}
                    {errorForm.kode && (
                        <Label className={styles.error}><Info size={14} /> Kode Barang Harus Diisi !</Label>
                    )}
                </section>

                {/* area nama */}
                <section>
                    {/* panggil reusable component CustomLabel 
                        (components/custom/CustomLabel.tsx)
                    */}
                    <CustomLabel htmlFor="txt_nama" required>Nama Barang</CustomLabel>

                    {/* panggil reusable component CustomInput 
                        (components/custom/CustomInput.tsx)
                    */}
                    <CustomInput
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
                    {errorForm.nama && (
                        <Label className={styles.error}><Info size={14} /> Nama Barang Harus Diisi !</Label>
                    )}
                </section>

                {/* area harga */}
                <section>
                    {/* panggil reusable component CustomLabel 
                        (components/custom/CustomLabel.tsx)
                    */}
                    <CustomLabel htmlFor="txt_harga" required>Harga Barang</CustomLabel>

                    {/* panggil reusable component CustomInput 
                        (components/custom/CustomInput.tsx)
                    */}
                    <CustomInput
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
                    {errorForm.harga && (
                        <Label className={styles.error}><Info size={14} /> Harga Barang Harus Diisi !</Label>
                    )}
                </section>

                {/* area satuan */}
                <section>
                    {/* panggil reusable component CustomLabel 
                        (components/custom/CustomLabel.tsx)
                    */}
                    <CustomLabel htmlFor="cbo_satuan" required>Satuan Barang</CustomLabel>
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
                    {errorForm.satuan && (
                        <Label className={styles.error}>
                            <Info size={14} /> Satuan Barang Harus Dipilih !
                        </Label>
                    )}
                </section>

                {/* area tombol */}
                <section className="flex sm:justify-start justify-center">
                    {/* area tombol */}
                    <section className="flex sm:justify-start justify-center">
                        {/* panggil reusable component ButtonPrimary 
                            (components/custom/CustomButtonPrimary.tsx)
                        */}
                        <CustomButtonPrimary label="Ubah" onClick={editData} />

                        {/* panggil reusable component ButtonSecondary 
                            (components/custom/CustomButtonSecondary.tsx)
                        */}
                        <CustomButtonSecondary label="Batal" />
                    </section>
                </section>
            </article>
        </>
    )
}

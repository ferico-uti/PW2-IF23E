// buat fungsi untuk format rupiah
export const formatRupiah = (value: number) => {
    return value.toLocaleString("id-ID");
};

// buat fungsi regex untuk kode barang
export const filterKode = (value: string) => {
  return value.replace(/[^A-Za-z0-9]/g, "");
};

// buat fungsi regex untuk nama barang
export const filterNama = (value: string) => {
  return value.replace(/[^A-Za-z0-9-.,'" ]/g, "");
};

// buat fungsi regex untuk harga barang
export const filterHarga = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

// buat fungsi regex untuk harga barang raw
export const filterHargaRaw = (value: string) => {
  return value.replace(/\./g, "");
};

// buat fungsi untuk format ribuan 
export const formatRibuan = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
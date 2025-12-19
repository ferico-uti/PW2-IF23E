import styles from "@/app/barang/barang.module.css";
import { ReactNode } from 'react';
import { Label } from "../ui/label";

// buat interface untuk label
interface CustomLabelProps {
    // xyz? = optional ditambahkan saat diakses
    htmlFor?: string;
    required?: boolean;
    // xyz = wajib ditambahkan saat diakses
    children: ReactNode;
}


export default function CustomLabel({ htmlFor, children, required = false }: CustomLabelProps) {
    return (
        <Label htmlFor={htmlFor} className={styles.label}>
            {children}

            {/* tambahkan * jika wajib isi/pilih */}
            {required && <span className={styles.error}>*</span>}
        </Label>
    )
}

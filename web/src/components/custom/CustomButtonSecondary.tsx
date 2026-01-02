import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

// buat interface untuk button secondary
interface CustomButtonSecondaryProps {
    // xyz? = optional ditambahkan saat diakses    
    label?: string;
}


export default function CustomButtonSecondary({ label = "" }: CustomButtonSecondaryProps) {
    // buat variabel untuk router
    const router = useRouter();

    return (
        <Button
            variant="secondary"
            onClick={() => router.back()}
            className={`rounded-full px-2.5 ml-1.5 w-[100px]`}
        >
            {label}
        </Button>
    )
}

import React from 'react'
import { Button } from '../ui/button';

// buat interface untuk button primary
interface CustomButtonPrimaryProps {
    // xyz? = optional ditambahkan saat diakses    
    label?: string;
    // xyz = wajib ditambahkan saat diakses
    onClick: () => void;
}


export default function CustomButtonPrimary({ label = "", onClick }: CustomButtonPrimaryProps) {
    return (
        <Button
            onClick={onClick}
            className={`rounded-full px-2.5 mr-1.5 w-[100px]`}
        >
            {label}
        </Button>
    )
}

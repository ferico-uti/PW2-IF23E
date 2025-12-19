import { ChangeEvent } from 'react';
import { Input } from '../ui/input';

// buat interface untuk input
interface CustomInputProps {
    // xyz? = optional ditambahkan saat diakses    
    type?: string;
    id?: string;
    placeholder?: string;
    maxLength?: number;
    value: string;
    // xyz = wajib ditambahkan saat diakses
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}


export default function CustomInput({ type, id, placeholder, maxLength, value, onChange }: CustomInputProps) {
    return (
        <Input
            type={type}
            id={id}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
        />
    )
}

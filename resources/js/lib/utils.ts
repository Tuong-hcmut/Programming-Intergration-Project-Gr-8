import { usePage } from '@inertiajs/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const useUser = () =>
    usePage().props.auth.user as App.Models.User | null;

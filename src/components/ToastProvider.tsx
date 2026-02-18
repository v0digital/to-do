// src/components/ToastProvider.tsx
'use client'

import { Toaster } from 'sonner'

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                className: 'toast',
                duration: 4000,
            }}
        />
    )
}
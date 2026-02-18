// src/components/ToastProvider.tsx
'use client'

import { Toaster } from 'sonner'

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            expand={false}
            richColors={false}
            closeButton
            // Configurações globais para manter o minimalismo v0
            toastOptions={{
                duration: 4000,
                style: {
                    borderRadius: '16px', // Equivalente a rounded-2xl
                },
                // Correção: Usamos classNames (plural) para mapear cada sub-elemento
                classNames: {
                    toast: 'group border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-950',
                    title: 'text-sm font-bold uppercase tracking-tight text-gray-800 dark:text-gray-50',
                    description: 'text-xs font-medium text-gray-400 dark:text-gray-200',
                    closeButton: 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200',
                    icon: 'text-gray-800 dark:text-gray-50',
                },
            }}
        />
    )
}
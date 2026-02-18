// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow Pro',
  description: 'Gerencie suas tarefas diárias de forma eficiente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50`} suppressHydrationWarning>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
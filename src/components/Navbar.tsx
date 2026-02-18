// src/components/Navbar.tsx
import Link from 'next/link'
import { CalendarDays, Bell, Clock } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-indigo-600">
                            <CalendarDays className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
                            <span className="ml-1 text-xs font-medium text-indigo-600">PRO</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                            Funcionalidades
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                            Como funciona
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                            Planos
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center rounded-lg bg-linear-to-r from-indigo-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg hover:from-indigo-700 hover:to-indigo-700 transition-all hover:shadow-xl"
                        >
                            Começar Grátis
                            <Bell className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
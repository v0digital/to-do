// src/components/Navbar.tsx
import Link from 'next/link'
import { CalendarDays, Bell, ArrowRight } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Brand Area */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-gray-800 to-gray-950 shadow-lg dark:from-gray-50 dark:to-gray-200">
                                <CalendarDays className="h-5 w-5 text-white dark:text-gray-950" />
                            </div>
                        </Link>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-50">v0 Digital</span>
                            <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-200 uppercase">SaaS Pro</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#tasks" className="text-sm font-semibold text-gray-400 transition-colors hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-50">
                            Funcionalidades
                        </Link>
                        <Link href="#charts" className="text-sm font-semibold text-gray-400 transition-colors hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-50">
                            Como funciona
                        </Link>
                    </div>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden rounded-xl px-4 py-2 text-sm font-bold text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-800 sm:inline-flex dark:text-gray-200 dark:hover:bg-gray-900 dark:hover:text-gray-50"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-800/10 transition-all hover:bg-gray-950 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200"
                        >
                            Começar Grátis
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
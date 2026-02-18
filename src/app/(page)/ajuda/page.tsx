// src/app/(page)/ajuda/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, BookOpen, MessageSquare, LifeBuoy } from 'lucide-react'

export default function AjudaPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <header className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tighter text-gray-800 dark:text-gray-50 uppercase mb-8">Central de Suporte</h1>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="BUSCAR DOCUMENTAÇÃO OU TUTORIAIS..." className="w-full h-14 pl-12 pr-6 rounded-2xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-gray-300 dark:focus:border-gray-700 transition-all" />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="flex gap-6 p-8 rounded-3xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950">
                        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-800 dark:text-gray-50"><BookOpen size={24} /></div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-2">Guia do Usuário</h3>
                            <p className="text-xs text-gray-400 font-medium">Aprenda a configurar seus primeiros fluxos operacionais.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 p-8 rounded-3xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950">
                        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-800 dark:text-gray-50"><LifeBuoy size={24} /></div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-2">Ticket Técnico</h3>
                            <p className="text-xs text-gray-400 font-medium">Abra um chamado direto com nossa equipe de engenharia.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
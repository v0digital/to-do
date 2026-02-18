// src/app/(page)/integracao/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Puzzle, Cpu, Globe, Zap } from 'lucide-react'

export default function IntegracaoPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
                        <Puzzle size={12} /> Ecossistema
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter text-gray-800 dark:text-gray-50 uppercase mb-6">Conexões nativas</h1>
                    <p className="text-lg text-gray-400 font-medium">Conecte o v0 Digital ao seu workflow existente com precisão cirúrgica.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Webhooks", desc: "Eventos em tempo real via HTTP POST.", icon: Zap },
                        { name: "Cloud Sync", desc: "Sincronização redundante multi-região.", icon: Globe },
                        { name: "Dev SDK", desc: "Bibliotecas prontas para TypeScript e PHP.", icon: Cpu },
                    ].map((item, i) => (
                        <div key={i} className="p-8 rounded-3xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 shadow-xs hover:border-gray-200 dark:hover:border-gray-800 transition-all">
                            <item.icon className="h-6 w-6 text-gray-800 dark:text-gray-50 mb-6" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-2">{item.name}</h3>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}
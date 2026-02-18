// src/app/(page)/seguranca/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react'

export default function SegurancaPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold tracking-tighter text-gray-800 dark:text-gray-50 uppercase mb-12">Protocolos de Segurança</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                            { title: "Criptografia", desc: "Dados protegidos via AES-256 em repouso e TLS 1.3 em trânsito.", icon: Lock },
                            { title: "Zero Trust", desc: "Arquitetura de acesso baseada em identidade e contexto.", icon: ShieldCheck },
                            { title: "Backup Real-time", desc: "Redundância geográfica ativa com RPO próximo a zero.", icon: Server },
                            { title: "Privacidade Ativa", desc: "Isolamento lógico de dados por tenant (empresa).", icon: EyeOff },
                        ].map((item, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <item.icon size={16} /> <span>{item.title}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-200 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
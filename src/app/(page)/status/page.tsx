// src/app/(page)/status/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Activity, CheckCircle2 } from 'lucide-react'

export default function StatusPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12 p-8 rounded-3xl bg-green-50/50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/20 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-green-600 dark:text-green-500">Sistemas Operacionais</h1>
                            <p className="text-sm font-bold text-green-600/70 uppercase">Todos os serviços estão operando normalmente</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-500 animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        {['API Gateway', 'Core ERP Engine', 'Database Clusters', 'CDN'].map(service => (
                            <div key={service} className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 dark:border-gray-900">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-gray-50">{service}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">99.99% UP</span>
                                    <CheckCircle2 size={16} className="text-green-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
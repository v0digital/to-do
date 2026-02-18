// src/app/(page)/termos/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FileText } from 'lucide-react'

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <article className="max-w-3xl mx-auto">
                    <header className="mb-12 border-b border-gray-100 dark:border-gray-900 pb-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                            <FileText size={14} />
                            <span>Acordo Legal</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter text-gray-800 dark:text-gray-50 uppercase">
                            Termos de Serviço
                        </h1>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Atualizado em 18.02.2026
                        </p>
                    </header>

                    <div className="space-y-10">
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-4">1. Licença de Uso</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Ao acessar o SaaS v0 Digital, concedemos uma licença não exclusiva e revogável para operar nossas ferramentas de automação e gestão operacional.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-4">2. Limites de Responsabilidade</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                A precisão das cronometragens depende da integridade do hardware e conexão do usuário. O v0 Digital não se responsabiliza por perdas operacionais decorrentes de falhas de rede externa.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-4">3. Rescisão</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                O usuário pode encerrar sua conta a qualquer momento. Em conformidade com a LGPD, todos os dados residuais serão expurgados de nossos clusters após 30 dias do encerramento.
                            </p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    )
}
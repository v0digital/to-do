// src/app/(page)/privacidade/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck } from 'lucide-react'

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <article className="max-w-3xl mx-auto">
                    <header className="mb-12 border-b border-gray-100 dark:border-gray-900 pb-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                            <ShieldCheck size={14} />
                            <span>Segurança de Dados</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter text-gray-800 dark:text-gray-50 uppercase">
                            Política de Privacidade
                        </h1>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Versão 2.0 • Fevereiro 2026
                        </p>
                    </header>

                    <div className="space-y-10">
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-4">1. Governança de Dados</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                No ecossistema v0 Digital, a privacidade é um requisito técnico, não opcional. Coletamos apenas os metadados necessários para a execução estável do ERP e autenticação via NextAuth/JWT.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-4">2. Propriedade Intelectual</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Todos os registros inseridos, cronometragens e dados de produtividade são de propriedade exclusiva do cliente. Não realizamos data-mining ou processamento para terceiros.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 mb-4">3. Infraestrutura</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Seus dados são processados em clusters isolados logicamente e criptografados em repouso seguindo o padrão AES-256.
                            </p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    )
}
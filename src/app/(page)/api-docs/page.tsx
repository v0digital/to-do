// src/app/(page)/api-docs/page.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Code2, Book, Terminal } from 'lucide-react'

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <header className="mb-16 border-b border-gray-100 dark:border-gray-900 pb-12">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                        <Terminal size={14} />
                        <span>Documentação Técnica</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter text-gray-800 dark:text-gray-50 uppercase">
                        API Reference <span className="text-gray-400">v4.0</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg font-medium text-gray-500 dark:text-gray-200">
                        Integre sua operação com precisão. Nossa API RESTful permite automação total dos fluxos ERP.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <section className="md:col-span-2 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-xl font-black uppercase tracking-tight text-gray-800 dark:text-gray-50">Autenticação</h2>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                Utilizamos o padrão Bearer Token via JWT para todas as requisições seguras.
                            </p>
                            <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-6 font-mono text-xs text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800">
                                Authorization: Bearer {'<YOUR_TOKEN>'}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-8">
                        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Recursos</h3>
                            <ul className="space-y-3">
                                {['Endpoints', 'Webhooks', 'Rate Limits', 'Errors'].map(item => (
                                    <li key={item} className="text-xs font-bold text-gray-800 dark:text-gray-50 uppercase tracking-tight hover:text-gray-400 cursor-pointer">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    )
}
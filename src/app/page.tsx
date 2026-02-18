// src/app/page.tsx
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  CheckCircle,
  Clock,
  Zap,
  Calendar,
  TrendingUp,
  Star,
  PlayCircle,
  ArrowRight,
  ShieldCheck,
  MousePointer2
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 selection:bg-gray-800 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Background Mesh/Grid Técnico */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge Premium */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-top-4 duration-700">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              SaaS de Alta Performance
            </div>

            <h1 className="mb-8 text-6xl font-bold tracking-tighter text-gray-800 dark:text-gray-50 sm:text-7xl lg:text-8xl">
              Domine sua{' '}
              <span className="bg-linear-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
                operação
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-gray-400 dark:text-gray-200 leading-relaxed tracking-tight">
              A arquitetura definitiva para desenvolvedores e empresas que exigem precisão.
              Gerencie ciclos, cronometre entregas e escale sua produtividade com v0 Digital.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <Link
                href="/register"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-gray-800 dark:bg-gray-50 px-10 text-xs font-black uppercase tracking-widest text-white dark:text-gray-950 transition-all hover:bg-gray-950 dark:hover:bg-white shadow-2xl shadow-gray-800/20"
              >
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/demo"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-10 text-xs font-black uppercase tracking-widest text-gray-800 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Live Demo
              </Link>
            </div>
          </div>

          {/* Dashboard Preview (Refatorado para o padrão ERP) */}
          <div className="relative mx-auto mt-24 max-w-5xl">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-linear-to-b from-gray-200 to-transparent dark:from-gray-800 blur-sm opacity-50" />
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
              {/* Toolbar do Browser Simulada */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 px-6 h-12">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1 text-[9px] font-bold text-gray-400 tracking-wider">
                  dashboard.v0digital.com.br
                </div>
                <MousePointer2 className="h-4 w-4 text-gray-300 dark:text-gray-600" />
              </div>

              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Stats Column */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tempo de Foco</span>
                        <Clock className="h-4 w-4 text-gray-800 dark:text-gray-50" />
                      </div>
                      <p className="text-4xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">04:42:00</p>
                      <div className="mt-4 h-1 w-full rounded-full bg-gray-100 dark:bg-gray-900">
                        <div className="h-full w-2/3 rounded-full bg-gray-800 dark:bg-gray-50" />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Eficiência</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">94.2%</p>
                    </div>
                  </div>

                  {/* Task List Column */}
                  <div className="lg:col-span-8">
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/30 p-6 h-full">
                      <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Fila de Produção</h3>
                      <div className="space-y-3">
                        {[
                          { title: 'Finalização da API v4', time: '12m restantes', status: 'IN_PROGRESS' },
                          { title: 'Deploy para Produção', time: 'Aguardando', status: 'PENDING' }
                        ].map((task, i) => (
                          <div key={i} className="flex items-center justify-between rounded-xl border border-white dark:border-gray-800 bg-white dark:bg-gray-950 p-4 shadow-sm transition-all hover:border-gray-300 dark:hover:border-gray-700">
                            <div className="flex items-center space-x-4">
                              <div className={`h-2 w-2 rounded-full ${task.status === 'IN_PROGRESS' ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'}`} />
                              <div>
                                <p className="text-xs font-bold text-gray-800 dark:text-gray-50 uppercase tracking-tight">{task.title}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{task.time}</p>
                              </div>
                            </div>
                            <MousePointer2 className="h-3 w-3 text-gray-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-y border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale transition-all hover:grayscale-0">
            {/* Aqui você pode colocar logos de empresas se houver */}
            <div className="flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Reliability</div>
            <div className="flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Scale</div>
            <div className="flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Precision</div>
            <div className="flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Security</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-12 border-t border-gray-100 dark:border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-800 dark:text-gray-50">
              v0 Digital <span className="text-gray-400 font-medium">ERP Systems</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              © {new Date().getFullYear()} v0 Digital. Automação técnica com precisão.
            </p>
            <div className="flex items-center gap-6">
              <ShieldCheck className="h-4 w-4 text-gray-300" />
              <Zap className="h-4 w-4 text-gray-300" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
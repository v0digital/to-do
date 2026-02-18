// src/app/page.tsx
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  CheckCircle,
  Clock,
  Bell,
  Mail,
  BarChart3,
  Users,
  Shield,
  Zap,
  Calendar,
  Target,
  TrendingUp,
  Star,
  PlayCircle // Adicionado às importações
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <Star className="mr-2 h-4 w-4 text-indigo-500" />
              Ferramenta de produtividade premiada
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-50 sm:text-6xl lg:text-7xl">
              Transforme sua{' '}
              <span className="bg-linear-to-br from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                produtividade
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-400 dark:text-gray-200 leading-relaxed">
              Gerencie tarefas, otimize tempo e alcance mais com nossa plataforma inteligente.
              Sistema completo com automação e notificações em tempo real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center rounded-xl bg-gray-800 dark:bg-gray-50 px-8 py-4 text-lg font-semibold text-white dark:text-gray-950 hover:bg-gray-950 dark:hover:bg-gray-200 transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                Começar Grátis
                <Zap className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-8 py-4 text-lg font-semibold text-gray-800 dark:text-gray-50 hover:border-indigo-600 transition-all"
              >
                <PlayCircle className="mr-3 h-5 w-5" />
                Ver Demonstração
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto mt-20 max-w-6xl">
            <div className="absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl">
              <div className="h-8 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center space-x-2 px-4 h-full">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">Tarefas Hoje</h3>
                        <Calendar className="h-5 w-5 text-indigo-500" />
                      </div>
                      <p className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-50">12</p>
                      <div className="mt-4 h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-3/4 rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">Produtividade</h3>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-50">87%</p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-100">+12% vs semana passada</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 h-full">
                      <h3 className="mb-6 font-semibold text-gray-800 dark:text-gray-50">Em Andamento</h3>
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
                            <div className="flex items-center space-x-4">
                              <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-50">Sprint Planning {i}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-100">v0 Digital Team</p>
                              </div>
                            </div>
                            <Clock className="h-5 w-5 text-gray-400" />
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

      {/* Footer Minimalista */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-200">
            © {new Date().getFullYear()} v0 Digital. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
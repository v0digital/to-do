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
  Star
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-size-[20px_20px]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              <Star className="mr-2 h-4 w-4" />
              Ferramenta de produtividade premiada
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Transforme sua{' '}
              <span className="bg-linear-to-r from-indigo-600 to-indigo-600 bg-clip-text text-transparent">
                produtividade
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600 leading-relaxed">
              Gerencie tarefas, otimize tempo e alcance mais com nossa plataforma inteligente.
              Sistema completo com automação, relatórios e notificações em tempo real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl hover:from-indigo-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-3xl hover:-translate-y-1"
              >
                Começar Grátis
                <Zap className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                <PlayCircle className="mr-3 h-5 w-5" />
                Ver Demonstração
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto mt-20 max-w-6xl">
            <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-indigo-500/20 to-indigo-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              <div className="h-8 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-2 px-4">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h3 w-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-linear-to-br from-indigo-50 to-indigo-50 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Tarefas Hoje</h3>
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <p className="mt-4 text-3xl font-bold text-gray-900">12</p>
                      <div className="mt-4 h-2 rounded-full bg-indigo-200">
                        <div className="h-full w-3/4 rounded-full bg-linear-to-r from-indigo-500 to-indigo-500" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Produtividade</h3>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="mt-4 text-3xl font-bold text-gray-900">87%</p>
                      <p className="mt-2 text-sm text-gray-600">+12% vs semana passada</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                      <h3 className="mb-6 font-semibold text-gray-900">Tarefas em Andamento</h3>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <div className="flex items-center space-x-4">
                              <div className="h-3 w-3 rounded-full bg-indigo-500" />
                              <div>
                                <p className="font-medium text-gray-900">Reunião de equipe {i}</p>
                                <p className="text-sm text-gray-600">45 min restantes</p>
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

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ferramentas <span className="text-indigo-600">poderosas</span> para seu sucesso
            </h2>
            <p className="text-lg text-gray-600">
              Tudo que você precisa para gerenciar tarefas, tempo e equipes de forma eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-indigo-300 hover:shadow-2xl"
              >
                <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-indigo-500/10 to-indigo-500/10" />
                </div>

                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-indigo-100 to-indigo-100">
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-r from-indigo-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-white">
              Pronto para transformar sua produtividade?
            </h2>
            <p className="mb-10 text-xl text-indigo-100">
              Junte-se a milhares de profissionais que já aumentaram sua eficiência em 40%
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-xl bg-white px-10 py-4 text-lg font-semibold text-indigo-600 shadow-2xl hover:bg-gray-100 transition-all hover:scale-105"
              >
                Começar Agora - Gratuito
              </Link>

              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-transparent px-10 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all"
              >
                <Users className="mr-3 h-5 w-5" />
                Agendar Demonstração
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-indigo-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-indigo-600">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">TaskFlow</span>
                <span className="ml-1 text-xs font-medium text-indigo-600">PRO</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Termos
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Contato
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Suporte
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} TaskFlow Pro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: <Clock className="h-7 w-7 text-indigo-600" />,
    title: 'Controle de Tempo Inteligente',
    description: 'Monitoramento automático do tempo gasto em cada tarefa com relatórios detalhados e insights de produtividade.'
  },
  {
    icon: <Bell className="h-7 w-7 text-indigo-600" />,
    title: 'Lembretes Contextuais',
    description: 'Sistema de alertas inteligentes que se adaptam ao seu ritmo de trabalho e prioridades.'
  },
  {
    icon: <Mail className="h-7 w-7 text-indigo-600" />,
    title: 'Notificações Multi-canal',
    description: 'Receba lembretes por email, push notifications e integração com apps de mensagem.'
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-indigo-600" />,
    title: 'Dashboard Analítico',
    description: 'Visualize sua produtividade com gráficos interativos e métricas em tempo real.'
  },
  {
    icon: <Users className="h-7 w-7 text-indigo-600" />,
    title: 'Gestão de Equipes',
    description: 'Colabore com sua equipe, delegue tarefas e acompanhe o progresso coletivo.'
  },
  {
    icon: <Shield className="h-7 w-7 text-indigo-600" />,
    title: 'Segurança Empresarial',
    description: 'Criptografia de ponta a ponta, backup automático e conformidade com LGPD.'
  }
]

const stats = [
  { value: '10K+', label: 'Usuários Ativos' },
  { value: '40%', label: 'Aumento de Produtividade' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9', label: 'Avaliação Média' }
]

// Adicionar componente PlayCircle se necessário
const PlayCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
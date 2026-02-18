// src/app/page.tsx
'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { motion } from "framer-motion"
import {
  TrendingUp,
  Star,
  PlayCircle,
  ArrowRight,
  LayoutDashboard,
  BarChart3,
  Plus,
  MoreVertical,
  Info,
  Target,
  Activity
} from 'lucide-react'
import Footer from '@/components/Footer'
import TechStark from '@/components/techStark'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 selection:bg-gray-800 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section id="tasks" className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

          {/* Dashboard Preview */}
          <div className="relative mx-auto mt-24 max-w-7xl">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-linear-to-b from-gray-200 to-transparent dark:from-gray-800 blur-sm opacity-50" />
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
              <div className="px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <LayoutDashboard size={12} />
                      <span>Gestão técnica (Visitante)</span>
                    </div>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-50 uppercase">
                      Olá, Visitante
                    </h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-xs font-bold text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 shadow-xs opacity-80">
                      <BarChart3 size={16} />
                      Análise
                    </div>
                    <div className="flex h-11 items-center gap-2 rounded-xl bg-gray-800 px-5 text-xs font-bold text-white dark:bg-gray-50 dark:text-gray-950 shadow-xs opacity-80">
                      <Plus size={16} />
                      Nova Tarefa
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-4">
                    {[
                      { title: 'Finalização da API v4', time: '12m restantes', status: 'IN_PROGRESS' },
                      { title: 'Deploy para Produção', time: 'Aguardando', status: 'PENDING' },
                      { title: 'Revisão de UI/UX', time: 'Finalizado', status: 'COMPLETED' }
                    ].map((task, i) => (
                      <div key={i} className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 p-5 shadow-sm">
                        <div className="flex items-center space-x-4">
                          <div className={`h-2.5 w-2.5 rounded-full ${task.status === 'IN_PROGRESS' ? 'bg-amber-500 animate-pulse' : task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-50 uppercase tracking-tight">{task.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task.time}</p>
                          </div>
                        </div>
                        <MoreVertical className="h-5 w-5 text-gray-300" />
                      </div>
                    ))}
                  </div>

                  <aside className="space-y-6">
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950 shadow-xs">
                      <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">Sumário</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Total', val: '3' },
                          { label: 'Em Curso', val: '1' },
                          { label: 'Finais', val: '1' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-gray-900 last:border-0 last:pb-0">
                            <span className="text-sm font-semibold text-gray-400 tracking-tight">{item.label}</span>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-50">{item.val}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-gray-900 border border-amber-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Info size={12} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Ambiente Demo</span>
                      </div>
                      <p className="text-[9px] font-bold text-amber-500 leading-relaxed uppercase tracking-tighter">
                        Este ambiente é volátil. Dados salvos apenas em memória (resetam ao atualizar).
                      </p>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section (Substituindo a antiga Trust Section) */}
      <TechStark />

      {/* Analytics Preview Section */}
      <section id="charts" className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">Eficiência Operacional</h2>
            <p className="text-4xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">Inteligência de dados em tempo real</p>
          </div>

          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Volume Total', val: '142', icon: Target, sub: '08 operando agora' },
                { label: 'Taxa de Entrega', val: '98.4%', icon: TrendingUp, sub: '124 finalizadas' },
                { label: 'Tempo Investido', val: '420m', icon: Activity, sub: 'Estimado: 380m' },
                { label: 'Performance Mensal', val: '92', icon: LayoutDashboard, sub: 'Fevereiro de 2026' }
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                      <span className="mt-1 text-2xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">{item.val}</span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                      <item.icon size={18} className="text-gray-800 dark:text-gray-50" />
                    </div>
                  </div>
                  <div className="mt-4 text-[10px] font-bold text-gray-400 dark:text-gray-200 uppercase tracking-tight opacity-70">
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-xl overflow-hidden">
              <div className="flex flex-col border-b border-gray-100 p-8 dark:border-gray-900 sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/30 dark:bg-gray-900/20">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-50">Analytics Center</h3>
                  <p className="text-xs font-medium text-gray-400">Visão técnica da carga de trabalho</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl gap-1">
                  <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg text-[10px] font-black uppercase text-gray-800 dark:text-gray-50 shadow-xs">Status</div>
                  <div className="px-4 py-2 text-[10px] font-black uppercase text-gray-400">Carga</div>
                  <div className="px-4 py-2 text-[10px] font-black uppercase text-gray-400">Agenda</div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Em Backlog', count: '12', color: 'bg-gray-400', theme: 'bg-gray-50 dark:bg-gray-900/40' },
                      { label: 'Processando', count: '08', color: 'bg-amber-500', theme: 'bg-amber-50/40 dark:bg-amber-500/5' }
                    ].map((p, i) => (
                      <div key={i} className={`rounded-2xl border border-transparent p-6 ${p.theme}`}>
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${p.color}`} />
                          <span className="text-[11px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-50">{p.label}</span>
                        </div>
                        <div className="mt-6 text-5xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">{p.count}</div>
                        <div className="mt-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Tasks</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Distribuição de Carga</h4>
                    <div className="space-y-4">
                      {[
                        { title: 'API Gateway Refactor', ratio: '85%', label: '32m / 40m', color: 'bg-gray-800 dark:bg-gray-50' },
                        { title: 'Database Optimization', ratio: '95%', label: '57m / 60m', color: 'bg-red-500' }
                      ].map((t, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-50 uppercase tracking-tight">{t.title}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.label}</span>
                          </div>
                          <div className="h-1 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${t.color}`} style={{ width: t.ratio }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
// src/app/demo/page.tsx
'use client'

import { useState, useMemo } from 'react'
import {
    LayoutDashboard,
    Plus,
    BarChart3,
    X,
    Clock,
    TrendingUp,
    MousePointer2,
    ChevronLeft,
    CalendarCheck,
    Bell,
    LogOut,
    User,
    CheckCircle,
    Info
} from 'lucide-react'
import Link from 'next/link'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import TaskCharts from '@/components/TaskCharts'

interface DemoTask {
    id: string
    title: string
    description?: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    timeSpent: number
    estimatedTime?: number
    startedAt?: string
    completedAt?: string
    createdAt: string
}

export default function DemoPage() {
    // ESTADO DAS TAREFAS (RESRETA AO F5)
    const initialTasks: DemoTask[] = [
        {
            id: '1',
            title: 'Finalização da API v4',
            description: 'Refatoração técnica dos endpoints de performance',
            status: 'IN_PROGRESS',
            timeSpent: 720,
            estimatedTime: 20,
            startedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Deploy para Produção',
            description: 'Configuração final de DNS e SSL',
            status: 'PENDING',
            timeSpent: 0,
            estimatedTime: 45,
            createdAt: new Date().toISOString()
        }
    ]

    const [tasks, setTasks] = useState<DemoTask[]>(initialTasks)
    const [showForm, setShowForm] = useState(false)
    const [editingTask, setEditingTask] = useState<DemoTask | null>(null)
    const [showCharts, setShowCharts] = useState(false)

    // HANDLERS LOCAIS (MIMIC API)
    const handleCreateTask = (data: any) => {
        const newTask: DemoTask = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            status: 'PENDING',
            timeSpent: 0,
            createdAt: new Date().toISOString()
        }
        setTasks([newTask, ...tasks])
        setShowForm(false)
    }

    const handleUpdateTask = (data: any) => {
        if (!editingTask) return
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...data } : t))
        setEditingTask(null)
        setShowForm(false)
    }

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id))
    }

    const handleStartTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? {
            ...t,
            status: 'IN_PROGRESS',
            startedAt: new Date().toISOString()
        } : t))
    }

    const handleCompleteTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? {
            ...t,
            status: 'COMPLETED',
            completedAt: new Date().toISOString()
        } : t))
    }

    const topStats = useMemo(() => {
        const completed = tasks.filter(t => t.status === 'COMPLETED').length
        const rate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0
        return { completed, rate: rate.toFixed(1) }
    }, [tasks])

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">

            {/* NAVBAR ORIGINAL DO SAAS (VERSÃO SIMULADA) */}
            <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-gray-800 to-gray-950 shadow-lg dark:from-gray-50 dark:to-gray-200">
                                    <CalendarCheck className="h-5 w-5 text-white dark:text-gray-950" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-50">v0 Digital</span>
                                    <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-200 uppercase">SaaS Pro (Demo)</span>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">1</span>
                            </button>

                            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900">
                                    <User className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="hidden flex-col sm:flex">
                                    <span className="text-xs font-bold text-gray-800 dark:text-gray-50">Visitante</span>
                                    <span className="text-[10px] font-medium text-gray-400">Modo Demo</span>
                                </div>
                                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
                                <Link href="/" className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                    <LogOut size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-7xl">

                {/* Dash Container Estilo Browser */}
                <div className="relative">
                    <div className="relative bg-white dark:bg-gray-950">

                        <div className="px-4 py-8 sm:px-6 lg:px-8">

                            {/* Sidebar Simulado */}
                            {showForm && (
                                <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40" onClick={() => setShowForm(false)} />
                            )}
                            <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 z-50 shadow-2xl transition-transform duration-300 transform ${showForm ? 'translate-x-0' : 'translate-x-full'}`}>
                                <div className="p-6 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                            {editingTask ? 'Editar Registro' : 'Novo Registro'}
                                        </h3>
                                        <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-400">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <TaskForm
                                        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                                        initialData={editingTask || undefined}
                                        loading={false}
                                    />
                                </div>
                            </aside>

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
                                    <button
                                        onClick={() => setShowCharts(!showCharts)}
                                        className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-xs font-bold text-gray-800 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900 shadow-xs"
                                    >
                                        <BarChart3 size={16} />
                                        {showCharts ? 'Ocultar Dash' : 'Análise'}
                                    </button>
                                    <button
                                        onClick={() => { setEditingTask(null); setShowForm(true); }}
                                        className="flex h-11 items-center gap-2 rounded-xl bg-gray-800 px-5 text-xs font-bold text-white transition-all hover:bg-gray-950 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200 shadow-xs"
                                    >
                                        <Plus size={16} />
                                        Nova Tarefa
                                    </button>
                                </div>
                            </header>

                            {showCharts && tasks.length > 0 && (
                                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <TaskCharts tasks={tasks} />
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                <div className="lg:col-span-2">
                                    <TaskList
                                        tasks={tasks}
                                        onDelete={handleDeleteTask}
                                        onStart={handleStartTask}
                                        onComplete={handleCompleteTask}
                                        onEdit={(t: any) => { setEditingTask(t); setShowForm(true); }}
                                        onCreateTask={() => { setEditingTask(null); setShowForm(true); }}
                                    />
                                </div>

                                <aside className="space-y-6">
                                    <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950 shadow-xs">
                                        <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">Sumário</h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Total', val: tasks.length },
                                                { label: 'Em Curso', val: tasks.filter(t => t.status === 'IN_PROGRESS').length },
                                                { label: 'Finais', val: tasks.filter(t => t.status === 'COMPLETED').length },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-gray-900 last:border-0 last:pb-0">
                                                    <span className="text-sm font-semibold text-gray-400 tracking-tight">{item.label}</span>
                                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-50">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-gray-900 border border-amber-100 dark:border-gray-800">
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
        </div>
    )
}
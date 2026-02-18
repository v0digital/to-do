// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { LayoutDashboard, Plus, BarChart3, Loader2, X } from 'lucide-react'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import TaskCharts from '@/components/TaskCharts'
import NotificationSound from '@/components/NotificationSound'

interface Task {
    id: string
    title: string
    description?: string
    status: string
    timeSpent: number
    estimatedTime?: number
    startedAt?: string
    completedAt?: string
    createdAt: string
}

interface User {
    id: string
    email: string
    name?: string
    emailVerified: boolean
}

export default function DashboardPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState<Task[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [showCharts, setShowCharts] = useState(false)
    const [playWarningSound, setPlayWarningSound] = useState(false)
    const [lastSoundPlayTime, setLastSoundPlayTime] = useState<number>(0)
    const [isSyncing, setIsSyncing] = useState(false)

    const loadUserAndTasks = useCallback(async () => {
        try {
            const userRes = await fetch('/api/auth/me')
            if (userRes.status === 401) {
                router.push('/login')
                return
            }
            const userData = await userRes.json()
            setUser(userData)

            const tasksRes = await fetch('/api/tasks')
            if (!tasksRes.ok) throw new Error('Falha na API')

            const tasksData = await tasksRes.json()
            setTasks(Array.isArray(tasksData) ? tasksData : [])
            setLoading(false)
        } catch (error) {
            console.error(error)
            toast.error('Erro ao carregar dados')
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        loadUserAndTasks()
    }, [loadUserAndTasks])

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now()
            const warnings = tasks.filter(t => {
                if (t.status === 'IN_PROGRESS' && t.startedAt && t.estimatedTime) {
                    const elapsed = Math.floor((now - new Date(t.startedAt).getTime()) / 1000)
                    const rem = (t.estimatedTime * 60) - elapsed
                    return rem <= 120 && rem > 0
                }
                return false
            })
            if (warnings.length > 0 && now - lastSoundPlayTime > 60000) {
                setPlayWarningSound(true)
                setLastSoundPlayTime(now)
                setTimeout(() => setPlayWarningSound(false), 1000)
            }
        }, 10000)
        return () => clearInterval(interval)
    }, [tasks, lastSoundPlayTime])

    const handleStartTask = async (id: string) => {
        try {
            const res = await fetch(`/api/tasks/${id}/time`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'start' })
            })
            if (res.ok) {
                toast.success('Tarefa iniciada!')
                await loadUserAndTasks()
            } else {
                const err = await res.json()
                toast.error(err.error || 'Erro ao iniciar')
            }
        } catch (e) {
            toast.error('Erro de conexão')
        }
    }

    const handleCompleteTask = async (id: string) => {
        try {
            const res = await fetch(`/api/tasks/${id}/time`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete' })
            })
            if (!res.ok) throw new Error()
            toast.success('Tarefa concluída!')
            loadUserAndTasks()
        } catch (e) {
            toast.error('Erro ao finalizar')
        }
    }

    const handleCreateTask = async (data: any) => {
        setIsSyncing(true)
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (!res.ok) throw new Error()
            toast.success('Tarefa criada')
            setShowForm(false)
            loadUserAndTasks()
        } catch (err) {
            toast.error('Erro ao salvar')
        } finally {
            setIsSyncing(false)
        }
    }

    const handleUpdateTask = async (data: any) => {
        if (!editingTask) return
        setIsSyncing(true)
        try {
            const res = await fetch(`/api/tasks/${editingTask.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (!res.ok) throw new Error()
            toast.success('Tarefa atualizada')
            setEditingTask(null)
            setShowForm(false)
            loadUserAndTasks()
        } catch (err) {
            toast.error('Erro ao editar')
        } finally {
            setIsSyncing(false)
        }
    }

    const handleDeleteTask = async (id: string) => {
        try {
            const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            toast.success('Removido')
            loadUserAndTasks()
        } catch (err) {
            toast.error('Erro ao excluir')
        }
    }

    if (loading) return (
        <div className="flex h-96 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-800 dark:text-gray-50" />
        </div>
    )

    return (
        <div className="w-full bg-white dark:bg-gray-950">
            <NotificationSound
                playSound={playWarningSound}
                title="Prazo Crítico"
                message="Tarefas prestes a expirar."
                soundType="alert"
            />

            {/* SIDEBAR OVERLAY */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-300"
                    onClick={() => { setShowForm(false); setEditingTask(null); }}
                />
            )}

            {/* SIDEBAR FORM */}
            <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 z-50 shadow-2xl transition-transform duration-300 transform ${showForm ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                {editingTask ? 'Editar Registro' : 'Novo Registro'}
                            </h3>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Painel de gerenciamento de tarefa</p>
                        </div>
                        <button
                            onClick={() => { setShowForm(false); setEditingTask(null); }}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-400 hover:text-gray-800 dark:hover:text-gray-50"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar focus:outline-hidden">
                        <TaskForm
                            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                            initialData={editingTask || undefined}
                            loading={isSyncing}
                        />
                    </div>
                </div>
            </aside>

            {/* HEADER SECTION */}
            <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <LayoutDashboard size={12} />
                        <span>Gestão Técnica</span>
                    </div>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-50 uppercase">
                        Olá, {user?.name || user?.email?.split('@')[0]}
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

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <TaskList
                        tasks={tasks}
                        onDelete={handleDeleteTask}
                        onStart={handleStartTask}
                        onComplete={handleCompleteTask}
                        onEdit={(t) => { setEditingTask(t); setShowForm(true); }}
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
                </aside>
            </div>
        </div>
    )
}
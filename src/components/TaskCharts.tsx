// src/components/TaskCharts.tsx
'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, Target, Clock, Calendar, ChevronLeft, ChevronRight, BarChart3, PieChart, LayoutDashboard, Activity } from 'lucide-react'
import { formatTime } from '@/lib/utils'

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

interface TaskChartsProps {
    tasks: Task[]
}

export default function TaskCharts({ tasks }: TaskChartsProps) {
    const [activeTab, setActiveTab] = useState<'progress' | 'time' | 'completion'>('progress')
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const stats = useMemo(() => {
        const total = tasks.length
        const completed = tasks.filter(t => t.status === 'COMPLETED')
        const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS')

        // Cálculo de tempo real (segundos para minutos)
        const totalTimeSpentMin = Math.floor(tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0) / 60)
        const totalEstimatedMin = tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0)

        return {
            total,
            completedCount: completed.length,
            pendingCount: tasks.filter(t => t.status === 'PENDING').length,
            inProgressCount: inProgress.length,
            totalEstimatedMin,
            totalTimeSpentMin,
            avgCompletionTime: completed.length > 0 ? totalTimeSpentMin / completed.length : 0,
            completionRate: total > 0 ? (completed.length / total) * 100 : 0,
            monthlyCompleted: completed.filter(t => {
                if (!t.completedAt) return false
                const d = new Date(t.completedAt)
                return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()
            }).length
        }
    }, [tasks, currentMonth])

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const days = []

        const prevMonthLastDay = new Date(year, month, 0).getDate()
        for (let i = firstDay; i > 0; i--) {
            days.push({ day: prevMonthLastDay - i + 1, current: false, date: new Date(year, month - 1, prevMonthLastDay - i + 1) })
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, current: true, date: new Date(year, month, i) })
        }
        const remaining = 42 - days.length
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, current: false, date: new Date(year, month + 1, i) })
        }
        return days
    }, [currentMonth])

    const tasksByDate = useMemo(() => {
        const map: Record<string, Task[]> = {}
        tasks.forEach(t => {
            if (t.status === 'COMPLETED' && t.completedAt) {
                const d = new Date(t.completedAt)
                const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
                if (!map[key]) map[key] = []
                map[key].push(t)
            }
        })
        return map
    }, [tasks])

    return (
        <div className="space-y-6">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Volume Total', val: stats.total, icon: Target, sub: `${stats.inProgressCount} operando agora` },
                    { label: 'Taxa de Entrega', val: `${stats.completionRate.toFixed(1)}%`, icon: TrendingUp, sub: `${stats.completedCount} finalizadas` },
                    { label: 'Tempo Investido', val: `${stats.totalTimeSpentMin}m`, icon: Activity, sub: `Estimado: ${stats.totalEstimatedMin}m` },
                    { label: 'Performance Mensal', val: stats.monthlyCompleted, icon: LayoutDashboard, sub: currentMonth.toLocaleDateString('pt-BR', { month: 'long' }) }
                ].map((item, i) => (
                    <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 transition-all hover:shadow-xs">
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

            {/* Analysis Card */}
            <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-sm overflow-hidden">
                <div className="flex flex-col border-b border-gray-100 p-6 dark:border-gray-900 sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-50">Analytics Center</h3>
                        <p className="text-xs font-medium text-gray-400">Monitoramento de eficiência operacional</p>
                    </div>
                    <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl gap-1">
                        {[
                            { id: 'progress', label: 'Status', icon: BarChart3 },
                            { id: 'time', label: 'Carga', icon: PieChart },
                            { id: 'completion', label: 'Agenda', icon: Calendar }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-white text-gray-950 shadow-xs dark:bg-gray-800 dark:text-gray-50'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            >
                                <tab.icon size={12} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8">
                    {activeTab === 'progress' && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {[
                                { label: 'Em Backlog', count: stats.pendingCount, color: 'bg-gray-400', theme: 'bg-gray-50 dark:bg-gray-900/40' },
                                { label: 'Processando', count: stats.inProgressCount, color: 'bg-amber-500', theme: 'bg-amber-50/40 dark:bg-amber-500/5' },
                                { label: 'Entregues', count: stats.completedCount, color: 'bg-green-500', theme: 'bg-green-50/40 dark:bg-green-500/5' }
                            ].map((p, i) => (
                                <div key={i} className={`rounded-2xl border border-transparent p-6 transition-all hover:border-gray-100 dark:hover:border-gray-800 ${p.theme}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${p.color}`} />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-50">{p.label}</span>
                                    </div>
                                    <div className="mt-6 text-5xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">{p.count}</div>
                                    <div className="mt-2 text-[10px] font-bold uppercase text-gray-400">Total de registros</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'time' && (
                        <div className="space-y-4">
                            {tasks.filter(t => (t.estimatedTime || 0) > 0).slice(0, 6).map(t => {
                                const timeSpentMin = Math.floor(t.timeSpent / 60)
                                const ratio = t.estimatedTime ? Math.min((timeSpentMin / t.estimatedTime) * 100, 100) : 0
                                return (
                                    <div key={t.id} className="rounded-2xl border border-gray-100 p-5 dark:border-gray-900 bg-white dark:bg-gray-950 hover:border-gray-200 dark:hover:border-gray-800 transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800 dark:text-gray-50 uppercase tracking-tight">{t.title}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Carga de Tempo</span>
                                            </div>
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${timeSpentMin > (t.estimatedTime || 0) ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {timeSpentMin}m / {t.estimatedTime}m
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${ratio > 90 ? 'bg-red-500' : 'bg-gray-800 dark:bg-gray-50'}`}
                                                style={{ width: `${ratio}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {activeTab === 'completion' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-4">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-50 transition-colors"><ChevronLeft size={18}/></button>
                                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-50 uppercase tracking-[0.2em]">{currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-50 transition-colors"><ChevronRight size={18}/></button>
                                </div>
                                <button onClick={() => setCurrentMonth(new Date())} className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-950 dark:hover:text-gray-50">Reset</button>
                            </div>

                            <div className="hidden grid-cols-7 border-t border-l border-gray-100 dark:border-gray-900 md:grid">
                                {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
                                    <div key={d} className="border-r border-b border-gray-100 bg-gray-50/50 p-3 text-center text-[9px] font-black uppercase tracking-widest text-gray-400 dark:border-gray-900 dark:bg-gray-900/30">{d}</div>
                                ))}
                                {calendarDays.map((d, i) => {
                                    const key = `${d.date.getFullYear()}-${d.date.getMonth() + 1}-${d.date.getDate()}`
                                    const dayTasks = tasksByDate[key] || []
                                    const isToday = d.date.toDateString() === new Date().toDateString()

                                    return (
                                        <div key={i} className={`min-h-24 border-r border-b border-gray-100 p-2 dark:border-gray-900 transition-colors ${!d.current ? 'bg-gray-50/20 opacity-30' : ''} ${isToday ? 'bg-gray-50/50 dark:bg-gray-900/40' : ''}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-[10px] font-bold ${isToday ? 'text-gray-950 dark:text-gray-50' : 'text-gray-400'}`}>{d.day}</span>
                                                {dayTasks.length > 0 && <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />}
                                            </div>
                                            <div className="space-y-1">
                                                {dayTasks.slice(0, 2).map(t => (
                                                    <div key={t.id} className="truncate rounded-md bg-green-500/10 px-1.5 py-0.5 text-[8px] font-black text-green-600 uppercase tracking-tighter border border-green-500/10">{t.title}</div>
                                                ))}
                                                {dayTasks.length > 2 && <span className="text-[8px] font-black text-gray-400 ml-1">+{dayTasks.length - 2}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="md:hidden text-center p-12 border border-dashed border-gray-200 rounded-3xl text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Visão de calendário otimizada para Desktop</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
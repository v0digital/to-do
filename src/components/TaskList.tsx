// src/components/TaskList.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { formatTime } from '@/lib/utils'
import TaskTimer from '@/components/TaskTimer'
import TimerSound from '@/components/TimerSound'
import {
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Play,
    Check,
    Edit,
    Trash2,
    Clock,
    Calendar,
    ChevronDown,
    AlertCircle,
    Inbox
} from 'lucide-react'

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

interface TaskListProps {
    tasks: Task[]
    onDelete: (id: string) => void
    onStart: (id: string) => void
    onComplete: (id: string) => void
    onEdit: (task: Task) => void
    onCreateTask?: () => void
}

export default function TaskList({ tasks = [], onDelete, onStart, onComplete, onEdit, onCreateTask }: TaskListProps) {
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [playWarningSound, setPlayWarningSound] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [tasksPerPage, setTasksPerPage] = useState(10)
    const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false)

    const itemsPerPageRef = useRef<HTMLDivElement>(null)

    // Sistema de áudio blindado contra erros de renderização
    const [pendingWarning, setPendingWarning] = useState(false)
    useEffect(() => {
        if (pendingWarning) {
            setPlayWarningSound(true)
            const t = setTimeout(() => {
                setPlayWarningSound(false);
                setPendingWarning(false);
            }, 1000)
            return () => clearTimeout(t)
        }
    }, [pendingWarning])

    const safeTasks = Array.isArray(tasks) ? tasks : []
    const filteredTasks = safeTasks.filter(task => {
        if (filter === 'all') return true
        if (filter === 'active') return task.status !== 'COMPLETED'
        return task.status === 'COMPLETED'
    })

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage)
    const currentTasks = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)

    const twoMinutesWarningTasks = safeTasks.filter(task => {
        if (task.status === 'IN_PROGRESS' && task.startedAt && task.estimatedTime) {
            const rem = (task.estimatedTime * 60) - Math.floor((Date.now() - new Date(task.startedAt).getTime()) / 1000)
            return rem <= 120 && rem > 0
        }
        return false
    })

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (itemsPerPageRef.current && !itemsPerPageRef.current.contains(e.target as Node)) {
                setShowItemsPerPageDropdown(false)
            }
            setOpenMenuId(null)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const triggerAction = (action: () => void) => {
        action()
        setOpenMenuId(null)
    }

    // Função auxiliar para tradução de status técnico
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendente'
            case 'IN_PROGRESS': return 'Em Curso'
            case 'COMPLETED': return 'Finalizada'
            default: return status
        }
    }

    return (
        <div className="space-y-6">
            <TimerSound playSound={playWarningSound} onSoundPlayed={() => setPlayWarningSound(false)} soundType="alert" />

            {twoMinutesWarningTasks.length > 0 && (
                <div className="flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50/30 p-4 dark:border-red-900/50 dark:bg-red-950/20 animate-pulse">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-red-800 dark:text-red-400 uppercase tracking-wider">Prioridade Alta</h4>
                        <p className="text-xs text-red-600 dark:text-red-300 font-medium">{twoMinutesWarningTasks.length} tarefa(s) no limite de tempo.</p>
                    </div>
                </div>
            )}

            {/* Filtros e Controles */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
                    {(['all', 'active', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setCurrentPage(1); }}
                            className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-50' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                        >
                            {f === 'all' ? 'Todas' : f === 'active' ? 'Ativas' : 'Finais'}
                        </button>
                    ))}
                </div>

                <div className="relative" ref={itemsPerPageRef}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowItemsPerPageDropdown(!showItemsPerPageDropdown); }}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                    >
                        {tasksPerPage} por página <ChevronDown size={14} />
                    </button>
                    {showItemsPerPageDropdown && (
                        <div className="absolute right-0 z-50 mt-2 w-32 rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-800 dark:bg-gray-950">
                            {[5, 10, 20, 50].map(val => (
                                <button
                                    key={val}
                                    onMouseDown={() => { setTasksPerPage(val); setCurrentPage(1); setShowItemsPerPageDropdown(false); }}
                                    className="w-full px-4 py-2 text-left text-xs font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-800 dark:hover:text-gray-50"
                                >
                                    {val} itens
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Lista de Resultados */}
            {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-20 dark:border-gray-800">
                    <Inbox className="text-gray-300 dark:text-gray-700" size={48} />
                    <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest text-center">Nenhum registro encontrado</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {currentTasks.map((task) => (
                        <div key={task.id} className="group relative rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-500' : task.status === 'IN_PROGRESS' ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'}`} />
                                        <h3 className="truncate text-base font-bold text-gray-800 dark:text-gray-50 uppercase tracking-tight">{task.title}</h3>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        <div className="flex items-center gap-1.5"><Clock size={12} /> {formatTime(task.timeSpent)}</div>
                                        {task.estimatedTime && <div className="flex items-center gap-1.5"><Calendar size={12} /> Est: {task.estimatedTime}m</div>}
                                        <div className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-900 text-[9px] uppercase tracking-tighter border border-gray-100 dark:border-gray-800">
                                            {getStatusLabel(task.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === task.id ? null : task.id); }}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {openMenuId === task.id && (
                                        <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-2xl dark:border-gray-800 dark:bg-gray-950 animate-in fade-in zoom-in-95">
                                            {task.status === 'PENDING' && (
                                                <button onMouseDown={() => triggerAction(() => onStart(task.id))} className="flex w-full items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">
                                                    <Play size={14} /> Iniciar
                                                </button>
                                            )}
                                            {task.status === 'IN_PROGRESS' && (
                                                <button onMouseDown={() => triggerAction(() => onComplete(task.id))} className="flex w-full items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">
                                                    <Check size={14} /> Concluir
                                                </button>
                                            )}
                                            <button onMouseDown={() => triggerAction(() => onEdit(task))} className="flex w-full items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">
                                                <Edit size={14} /> Editar
                                            </button>
                                            <button onMouseDown={() => triggerAction(() => onDelete(task.id))} className="flex w-full items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                                <Trash2 size={14} /> Excluir
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {task.status === 'IN_PROGRESS' && task.startedAt && task.estimatedTime && (
                                <div className="mt-5 border-t border-gray-50 pt-5 dark:border-gray-900">
                                    <TaskTimer
                                        taskId={task.id}
                                        startedAt={task.startedAt}
                                        estimatedTime={task.estimatedTime}
                                        onTwoMinutesWarning={() => setPendingWarning(true)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pág {currentPage} / {totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(v => v - 1)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-800 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(v => v + 1)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-800 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
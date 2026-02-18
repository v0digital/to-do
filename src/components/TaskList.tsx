// src/components/TaskList.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { formatTime } from '@/lib/utils'
import TaskTimer from '@/components/TaskTimer'
import TimerSound from '@/components/TimerSound'
import { ChevronLeft, ChevronRight, MoreVertical, Play, Check, Edit, Trash2, Clock, Calendar, FileText, ChevronDown } from 'lucide-react'

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
    const [activeWarningTask, setActiveWarningTask] = useState<string | null>(null)

    // Estados para paginação
    const [currentPage, setCurrentPage] = useState(1)
    const [tasksPerPage, setTasksPerPage] = useState(10)

    // Estados para dropdowns
    const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false)
    const [showGoToPageDropdown, setShowGoToPageDropdown] = useState(false)

    // Refs para detectar cliques fora dos dropdowns
    const itemsPerPageDropdownRef = useRef<HTMLDivElement>(null)
    const goToPageDropdownRef = useRef<HTMLDivElement>(null)

    // Garantir que tasks é um array
    const safeTasks = Array.isArray(tasks) ? tasks : []

    const filteredTasks = safeTasks.filter(task => {
        if (filter === 'all') return true
        if (filter === 'active') return task.status !== 'COMPLETED'
        if (filter === 'completed') return task.status === 'COMPLETED'
        return true
    })

    // Cálculos para paginação
    const totalTasks = filteredTasks.length
    const totalPages = Math.ceil(totalTasks / tasksPerPage)

    // Ajustar página atual se necessário
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages)
        }
    }, [totalTasks, tasksPerPage, currentPage, totalPages])

    // Obter tarefas para a página atual
    const indexOfLastTask = currentPage * tasksPerPage
    const indexOfFirstTask = indexOfLastTask - tasksPerPage
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask)

    // Contar tarefas com aviso de 2 minutos
    const twoMinutesWarningTasks = safeTasks.filter(task => {
        if (task.status === 'IN_PROGRESS' && task.startedAt && task.estimatedTime) {
            const startedAt = new Date(task.startedAt).getTime()
            const now = Date.now()
            const elapsedSeconds = Math.floor((now - startedAt) / 1000)
            const totalEstimatedSeconds = task.estimatedTime * 60
            const remainingSeconds = Math.max(0, totalEstimatedSeconds - elapsedSeconds)

            return remainingSeconds <= 120 && remainingSeconds > 0
        }
        return false
    })

    // Fechar dropdowns ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (itemsPerPageDropdownRef.current && !itemsPerPageDropdownRef.current.contains(event.target as Node)) {
                setShowItemsPerPageDropdown(false)
            }
            if (goToPageDropdownRef.current && !goToPageDropdownRef.current.contains(event.target as Node)) {
                setShowGoToPageDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMenuToggle = (taskId: string) => {
        setOpenMenuId(openMenuId === taskId ? null : taskId)
    }

    const handleMenuClose = () => {
        setOpenMenuId(null)
    }

    const handleAction = (action: () => void) => {
        action()
        handleMenuClose()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-300'
            case 'IN_PROGRESS': return 'bg-indigo-50 text-indigo-800 border-indigo-200'
            case 'COMPLETED': return 'bg-green-50 text-green-800 border-green-200'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendente'
            case 'IN_PROGRESS': return 'Em Andamento'
            case 'COMPLETED': return 'Concluída'
            default: return status
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return '⏳'
            case 'IN_PROGRESS': return '▶️'
            case 'COMPLETED': return '✅'
            default: return '📝'
        }
    }

    const getEmptyMessage = () => {
        switch (filter) {
            case 'all':
                return 'Nenhuma tarefa encontrada. Clique em "Nova Tarefa" para começar!'
            case 'active':
                return 'Nenhuma tarefa ativa no momento. Todas as tarefas estão concluídas ou você ainda não criou nenhuma.'
            case 'completed':
                return 'Nenhuma tarefa concluída ainda. Complete suas tarefas para vê-las aqui!'
            default:
                return 'Nenhuma tarefa encontrada.'
        }
    }

    // Função para lidar com aviso de 2 minutos
    const handleTwoMinutesWarning = (taskId: string) => {
        setPlayWarningSound(true)
        setActiveWarningTask(taskId)

        // Resetar após 1 segundo para permitir tocar novamente
        setTimeout(() => {
            setPlayWarningSound(false)
        }, 1000)
    }

    // Função para lidar com tempo expirado
    const handleTimeExpired = (taskId: string) => {
        console.log(`Tempo expirado para tarefa ${taskId}`)
    }

    // Funções de paginação
    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        setShowGoToPageDropdown(false)
    }

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    // Função para alterar itens por página
    const handleItemsPerPageChange = (value: number) => {
        setTasksPerPage(value)
        setCurrentPage(1)
        setShowItemsPerPageDropdown(false)
    }

    // Gerar array de páginas para exibição
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            let startPage = Math.max(1, currentPage - 2)
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1)
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i)
            }
        }

        return pageNumbers
    }

    // Opções para itens por página
    const itemsPerPageOptions = [5, 10, 20, 50]

    return (
        <div className="space-y-4">
            {/* Componente de som global */}
            <TimerSound
                playSound={playWarningSound}
                onSoundPlayed={() => setPlayWarningSound(false)}
                soundType="alert"
            />

            {/* Aviso de tarefas com 2 minutos */}
            {twoMinutesWarningTasks.length > 0 && (
                <div className="bg-linear-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-linear-to-r from-red-500 to-orange-500 flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-red-900">
                                ⚠️ {twoMinutesWarningTasks.length} tarefa{twoMinutesWarningTasks.length !== 1 ? 's' : ''} com menos de 2 minutos!
                            </h4>
                            <p className="text-sm text-red-700">
                                {twoMinutesWarningTasks.map(t => t.title).join(', ')}
                            </p>
                        </div>
                        <div className="text-2xl animate-bounce">⏰</div>
                    </div>
                </div>
            )}

            {/* Filtros e Controles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => {
                            setFilter('all')
                            setCurrentPage(1)
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Todas ({safeTasks.length})
                    </button>
                    <button
                        onClick={() => {
                            setFilter('active')
                            setCurrentPage(1)
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Ativas ({safeTasks.filter(t => t.status !== 'COMPLETED').length})
                    </button>
                    <button
                        onClick={() => {
                            setFilter('completed')
                            setCurrentPage(1)
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Concluídas ({safeTasks.filter(t => t.status === 'COMPLETED').length})
                    </button>
                </div>

                {/* Controle de itens por página - DROPDOWN */}
                <div className="flex items-center gap-2" ref={itemsPerPageDropdownRef}>
                    <label className="text-sm text-gray-600">Itens por página:</label>
                    <div className="relative">
                        <button
                            onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                        >
                            <span>{tasksPerPage}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showItemsPerPageDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showItemsPerPageDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-24 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                {itemsPerPageOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleItemsPerPageChange(option)}
                                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${tasksPerPage === option ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mensagem de tarefas vazias */}
            {filteredTasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {filter === 'all' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            ) : filter === 'active' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                        </svg>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'all' ? 'Nenhuma tarefa' :
                            filter === 'active' ? 'Nenhuma tarefa ativa' :
                                'Nenhuma tarefa concluída'}
                    </h3>

                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {getEmptyMessage()}
                    </p>

                    {filter === 'all' && onCreateTask && (
                        <button
                            onClick={onCreateTask}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Criar minha primeira tarefa
                        </button>
                    )}

                    {filter === 'completed' && safeTasks.length > 0 && (
                        <button
                            onClick={() => {
                                setFilter('all')
                                setCurrentPage(1)
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Ver todas as tarefas
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Lista de Tarefas */}
                    <div className="grid gap-4">
                        {currentTasks.map((task) => (
                            <div key={task.id} className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <span className="text-lg">{getStatusIcon(task.status)}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate" title={task.title}>
                                                    {task.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                                                        {getStatusText(task.status)}
                                                    </span>
                                                    {task.estimatedTime && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {task.estimatedTime}min estimados
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative ml-2">
                                        <button
                                            onClick={() => handleMenuToggle(task.id)}
                                            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {openMenuId === task.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                {task.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleAction(() => onStart(task.id))}
                                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        <span>Iniciar</span>
                                                    </button>
                                                )}
                                                {task.status === 'IN_PROGRESS' && (
                                                    <button
                                                        onClick={() => handleAction(() => onComplete(task.id))}
                                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        <span>Concluir</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction(() => onEdit(task))}
                                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    <span>Editar</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAction(() => onDelete(task.id))}
                                                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Excluir</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {task.description && (
                                    <div className="mb-3">
                                        <div className="flex items-start gap-2 text-gray-600">
                                            <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                                            <p className="text-sm">{task.description}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>Tempo gasto: {formatTime(task.timeSpent)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Criada: {new Date(task.createdAt).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    {task.completedAt && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Check className="w-4 h-4" />
                                            <span>Concluída: {new Date(task.completedAt).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Cronômetro para tarefas em andamento */}
                                {task.status === 'IN_PROGRESS' && task.startedAt && task.estimatedTime && (
                                    <TaskTimer
                                        taskId={task.id}
                                        startedAt={task.startedAt}
                                        estimatedTime={task.estimatedTime}
                                        onTimeExpired={() => handleTimeExpired(task.id)}
                                        onTwoMinutesWarning={() => handleTwoMinutesWarning(task.id)}
                                    />
                                )}

                                {task.startedAt && task.status === 'IN_PROGRESS' && !task.estimatedTime && (
                                    <div className="mt-3 p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800 text-sm">
                                        ⏱️ Em andamento desde {new Date(task.startedAt).toLocaleString('pt-BR')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-600">
                                    Mostrando <span className="font-semibold">{indexOfFirstTask + 1}-{Math.min(indexOfLastTask, totalTasks)}</span> de <span className="font-semibold">{totalTasks}</span> tarefas
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Botão Anterior */}
                                    <button
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {/* Números das páginas */}
                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${currentPage === page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Botão Próximo */}
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Seletor de página - DROPDOWN */}
                                <div className="flex items-center gap-2" ref={goToPageDropdownRef}>
                                    <span className="text-sm text-gray-600">Ir para:</span>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowGoToPageDropdown(!showGoToPageDropdown)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <span>Página {currentPage}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showGoToPageDropdown ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showGoToPageDropdown && (
                                            <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToPage(page)}
                                                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${currentPage === page ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}`}
                                                    >
                                                        Página {page}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
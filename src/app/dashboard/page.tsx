// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import TaskCharts from '@/components/TaskCharts'
import TimerSound from '@/components/TimerSound'
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
    const [showCharts, setShowCharts] = useState(false) // ALTERADO: false por padrão
    const [playWarningSound, setPlayWarningSound] = useState(false)
    const [lastSoundPlayTime, setLastSoundPlayTime] = useState<number>(0)

    useEffect(() => {
        const message = searchParams.get('message')
        if (message) {
            toast.success(message)
        }

        loadUserAndTasks()

        // Verificar tarefas com 2 minutos a cada 10 segundos
        const checkInterval = setInterval(() => {
            checkTwoMinuteWarnings()
        }, 10000)

        return () => clearInterval(checkInterval)
    }, [tasks])

    const loadUserAndTasks = async () => {
        try {
            const userRes = await fetch('/api/auth/me')
            if (userRes.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.')
                router.push('/auth/login')
                return
            }

            const userText = await userRes.text()
            if (!userText) {
                throw new Error('Resposta vazia do servidor')
            }

            const userData = JSON.parse(userText)
            setUser(userData)

            if (!userData.emailVerified) {
                toast.error('Por favor, verifique seu email antes de acessar o dashboard.')
                router.push('/auth/login?error=Email não verificado')
                return
            }

            const tasksRes = await fetch('/api/tasks')

            if (!tasksRes.ok) {
                if (tasksRes.status === 405) {
                    throw new Error('API não configurada corretamente. Tente novamente em alguns segundos.')
                }
                throw new Error(`Erro ao carregar tarefas: ${tasksRes.status}`)
            }

            const tasksText = await tasksRes.text()
            if (!tasksText) {
                setTasks([])
            } else {
                const tasksData = JSON.parse(tasksText)
                setTasks(Array.isArray(tasksData) ? tasksData : [])
            }

            setLoading(false)

        } catch (error) {
            console.error('Error loading data:', error)

            if (error instanceof Error) {
                if (error.message.includes('JSON')) {
                    toast.error('Erro no formato dos dados. Tente novamente.')
                } else if (error.message.includes('405')) {
                    toast.error('Sistema em manutenção. Recarregando...')
                    setTimeout(() => {
                        loadUserAndTasks()
                    }, 2000)
                } else {
                    toast.error(error.message || 'Erro ao carregar dados')
                }
            } else {
                toast.error('Erro desconhecido ao carregar dados')
            }

            setTimeout(() => {
                loadUserAndTasks()
            }, 3000)
        }
    }

    // Verificar tarefas com ≤ 2 minutos restantes
    const checkTwoMinuteWarnings = () => {
        const now = Date.now()
        const twoMinutesTasks = tasks.filter(task => {
            if (task.status === 'IN_PROGRESS' && task.startedAt && task.estimatedTime) {
                const startedAt = new Date(task.startedAt).getTime()
                const elapsedSeconds = Math.floor((now - startedAt) / 1000)
                const totalEstimatedSeconds = task.estimatedTime * 60
                const remainingSeconds = Math.max(0, totalEstimatedSeconds - elapsedSeconds)

                // ≤ 2 minutos e > 0 segundos
                return remainingSeconds <= 120 && remainingSeconds > 0
            }
            return false
        })

        // Tocar som se houver tarefas com 2 minutos e não tocou recentemente
        if (twoMinutesTasks.length > 0 && now - lastSoundPlayTime > 30000) { // 30 segundos de cooldown
            setPlayWarningSound(true)
            setLastSoundPlayTime(now)

            // Resetar após 1 segundo
            setTimeout(() => {
                setPlayWarningSound(false)
            }, 1000)
        }
    }

    const handleCreateTask = async (data: { title: string; description: string; estimatedTime?: number }) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                const responseText = await response.text()
                const newTask = responseText ? JSON.parse(responseText) : null

                if (newTask) {
                    setTasks([newTask, ...tasks])
                    setShowForm(false)
                    toast.success('Tarefa criada com sucesso!')

                    setTimeout(() => {
                        loadUserAndTasks()
                    }, 500)
                }
            } else {
                const errorText = await response.text()
                const error = errorText ? JSON.parse(errorText) : { error: 'Erro desconhecido' }
                toast.error(error.error || 'Erro ao criar tarefa')
            }
        } catch (error) {
            console.error('Error creating task:', error)
            toast.error('Erro ao criar tarefa')
        }
    }

    const handleUpdateTask = async (data: { title: string; description: string; estimatedTime?: number }) => {
        if (!editingTask) return

        try {
            const response = await fetch(`/api/tasks/${editingTask.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                const responseText = await response.text()
                const updatedTask = responseText ? JSON.parse(responseText) : null

                if (updatedTask) {
                    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
                    setEditingTask(null)
                    setShowForm(false)
                    toast.success('Tarefa atualizada com sucesso!')

                    setTimeout(() => {
                        loadUserAndTasks()
                    }, 500)
                }
            } else {
                const errorText = await response.text()
                const error = errorText ? JSON.parse(errorText) : { error: 'Erro desconhecido' }
                toast.error(error.error || 'Erro ao atualizar tarefa')
            }
        } catch (error) {
            console.error('Error updating task:', error)
            toast.error('Erro ao atualizar tarefa')
        }
    }

    const handleDeleteTask = async (id: string) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setTasks(tasks.filter(t => t.id !== id))
                toast.success('Tarefa excluída com sucesso!')

                setTimeout(() => {
                    loadUserAndTasks()
                }, 500)
            } else {
                const errorText = await response.text()
                const error = errorText ? JSON.parse(errorText) : { error: 'Erro desconhecido' }
                toast.error(error.error || 'Erro ao excluir tarefa')
            }
        } catch (error) {
            console.error('Error deleting task:', error)
            toast.error('Erro ao excluir tarefa')
        }
    }

    const handleStartTask = async (id: string) => {
        try {
            const response = await fetch(`/api/tasks/${id}/time`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'start' })
            })

            if (response.ok) {
                const responseText = await response.text()
                const updatedTask = responseText ? JSON.parse(responseText) : null

                if (updatedTask) {
                    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
                    toast.success('Tarefa iniciada!')

                    setTimeout(() => {
                        loadUserAndTasks()
                    }, 500)
                }
            } else {
                const errorText = await response.text()
                const error = errorText ? JSON.parse(errorText) : { error: 'Erro desconhecido' }
                toast.error(error.error || 'Erro ao iniciar tarefa')
            }
        } catch (error) {
            console.error('Error starting task:', error)
            toast.error('Erro ao iniciar tarefa')
        }
    }

    const handleCompleteTask = async (id: string) => {
        try {
            const response = await fetch(`/api/tasks/${id}/time`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete' })
            })

            if (response.ok) {
                const responseText = await response.text()
                const updatedTask = responseText ? JSON.parse(responseText) : null

                if (updatedTask) {
                    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
                    toast.success('Tarefa concluída!')

                    setTimeout(() => {
                        loadUserAndTasks()
                    }, 500)
                }
            } else {
                const errorText = await response.text()
                const error = errorText ? JSON.parse(errorText) : { error: 'Erro desconhecido' }
                toast.error(error.error || 'Erro ao concluir tarefa')
            }
        } catch (error) {
            console.error('Error completing task:', error)
            toast.error('Erro ao concluir tarefa')
        }
    }

    const handleEditTask = (task: Task) => {
        setEditingTask(task)
        setShowForm(true)
    }

    const handleCreateFirstTask = () => {
        setEditingTask(null)
        setShowForm(true)
    }

    // Contar tarefas com cronômetro ativo
    const activeTimersCount = tasks.filter(t =>
        t.status === 'IN_PROGRESS' && t.estimatedTime && t.startedAt
    ).length

    // Contar tarefas com ≤ 2 minutos restantes
    const twoMinutesWarningCount = tasks.filter(task => {
        if (task.status === 'IN_PROGRESS' && task.startedAt && task.estimatedTime) {
            const startedAt = new Date(task.startedAt).getTime()
            const now = Date.now()
            const elapsedSeconds = Math.floor((now - startedAt) / 1000)
            const totalEstimatedSeconds = task.estimatedTime * 60
            const remainingSeconds = Math.max(0, totalEstimatedSeconds - elapsedSeconds)

            return remainingSeconds <= 120 && remainingSeconds > 0
        }
        return false
    }).length

    // Obter nomes das tarefas com 2 minutos
    const twoMinutesWarningTasks = tasks.filter(task => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Carregando...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto pb-16 xl:pb-0">
            {/* Componente de som global */}
            <NotificationSound
                playSound={playWarningSound}
                title="⚠️ Alerta de 2 Minutos"
                message={`${twoMinutesWarningCount} tarefa(s) com menos de 2 minutos restantes!`}
                soundType="alert"
            />

            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">
                            Bem-vindo, {user?.name || user?.email?.split('@')[0]}
                            {user?.emailVerified && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    ✓ Email verificado
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Botão melhorado para mostrar/ocultar gráficos */}
                        <button
                            onClick={() => setShowCharts(!showCharts)}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            {showCharts ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Ocultar Gráficos</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span>Mostrar Gráficos</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setEditingTask(null)
                                setShowForm(!showForm)
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            {showForm ? 'Cancelar' : 'Nova Tarefa'}
                        </button>
                    </div>
                </div>
            </div>

            {/* SEÇÃO DE CRONÔMETROS ATIVOS */}
            {activeTimersCount > 0 && (
                <div className="mb-6 bg-linear-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-indigo-900">Cronômetros Ativos</h3>
                            <p className="text-sm text-indigo-700">
                                {activeTimersCount} tarefa{activeTimersCount !== 1 ? 's' : ''} com contagem regressiva em andamento
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                                {tasks
                                    .filter(t => t.status === 'IN_PROGRESS' && t.estimatedTime && t.startedAt)
                                    .slice(0, 3)
                                    .map((task, index) => (
                                        <div
                                            key={task.id}
                                            className="h-8 w-8 rounded-full bg-linear-to-r from-indigo-400 to-indigo-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                                            style={{ zIndex: 10 - index }}
                                        >
                                            {index === 2 ? '+' : task.title.charAt(0).toUpperCase()}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SEÇÃO DE ALERTAS DE 2 MINUTOS */}
            {twoMinutesWarningCount > 0 && (
                <div className="mb-6 bg-linear-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200 animate-pulse">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-linear-to-r from-red-500 to-orange-600 flex items-center justify-center mr-4">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-red-900">⚠️ Alertas de 2 Minutos</h3>
                            <p className="text-sm text-red-700">
                                {twoMinutesWarningCount} tarefa{twoMinutesWarningCount !== 1 ? 's' : ''} com menos de 2 minutos restantes!
                            </p>
                            {twoMinutesWarningTasks.length > 0 && (
                                <p className="text-xs text-red-600 mt-1">
                                    {twoMinutesWarningTasks.slice(0, 2).map(t => t.title).join(', ')}
                                    {twoMinutesWarningTasks.length > 2 && ` e mais ${twoMinutesWarningTasks.length - 2}`}
                                </p>
                            )}
                        </div>
                        <div className="text-2xl animate-bounce">⏰</div>
                    </div>
                </div>
            )}

            {/* GRÁFICOS - Agora começa FECHADO */}
            {showCharts && tasks.length > 0 && (
                <div className="mb-8">
                    <TaskCharts tasks={tasks} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-semibold">Suas Tarefas</h2>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="text-sm text-gray-600">
                                {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} • {activeTimersCount} cronômetro{activeTimersCount !== 1 ? 's' : ''} ativo{activeTimersCount !== 1 ? 's' : ''}
                                {twoMinutesWarningCount > 0 && (
                                    <span className="ml-2 text-red-600 font-medium">
                                        • {twoMinutesWarningCount} com alerta
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                                    <span className="text-xs text-gray-600">Tempo bom</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                                    <span className="text-xs text-gray-600">Metade</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                                    <span className="text-xs text-gray-600">Urgente</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(showForm || editingTask) ? (
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h3 className="text-lg font-medium mb-4">
                                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                            </h3>
                            <TaskForm
                                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                                initialData={editingTask || undefined}
                            />
                        </div>
                    ) : null}

                    <TaskList
                        tasks={tasks}
                        onDelete={handleDeleteTask}
                        onStart={handleStartTask}
                        onComplete={handleCompleteTask}
                        onEdit={handleEditTask}
                        onCreateTask={handleCreateFirstTask}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4">Resumo Rápido</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total de tarefas:</span>
                                <span className="font-medium">{tasks.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pendentes:</span>
                                <span className="font-medium">
                                    {tasks.filter(t => t.status === 'PENDING').length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Em andamento:</span>
                                <span className="font-medium">
                                    {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Concluídas:</span>
                                <span className="font-medium">
                                    {tasks.filter(t => t.status === 'COMPLETED').length}
                                </span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Com cronômetro:</span>
                                    <span className="font-medium text-indigo-600">
                                        {activeTimersCount}
                                    </span>
                                </div>
                                {twoMinutesWarningCount > 0 && (
                                    <div className="flex justify-between mt-2">
                                        <span className="text-gray-600">Com ≤ 2 minutos:</span>
                                        <span className="font-medium text-red-600">
                                            {twoMinutesWarningCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4">Tarefas em Andamento</h3>
                        {tasks.filter(t => t.status === 'IN_PROGRESS').length === 0 ? (
                            <p className="text-gray-500 text-sm">Nenhuma tarefa em andamento</p>
                        ) : (
                            <ul className="space-y-3">
                                {tasks
                                    .filter(t => t.status === 'IN_PROGRESS')
                                    .slice(0, 3)
                                    .map(task => {
                                        const isTwoMinuteWarning = twoMinutesWarningTasks.some(t => t.id === task.id)
                                        return (
                                            <li key={task.id} className={`border-l-4 pl-3 ${isTwoMinuteWarning ? 'border-red-500 animate-pulse' : 'border-yellow-500'}`}>
                                                <p className="font-medium text-sm">{task.title}</p>
                                                <p className="text-xs text-gray-600">
                                                    Iniciada: {new Date(task.startedAt!).toLocaleDateString('pt-BR')}
                                                </p>
                                                {task.estimatedTime && (
                                                    <div className="mt-1 flex items-center">
                                                        <div className={`h-2 w-2 rounded-full mr-2 ${isTwoMinuteWarning ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                                        <p className="text-xs text-gray-700 font-medium">
                                                            {task.estimatedTime} min estimados
                                                            {isTwoMinuteWarning && (
                                                                <span className="text-red-600 ml-1">(URGENTE!)</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </li>
                                        )
                                    })}
                                {tasks.filter(t => t.status === 'IN_PROGRESS').length > 3 && (
                                    <li className="text-sm text-gray-500 text-center pt-2 border-t border-gray-100">
                                        +{tasks.filter(t => t.status === 'IN_PROGRESS').length - 3} mais
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4">Últimas Concluídas</h3>
                        {tasks.filter(t => t.status === 'COMPLETED').length === 0 ? (
                            <p className="text-gray-500 text-sm">Nenhuma tarefa concluída ainda</p>
                        ) : (
                            <ul className="space-y-3">
                                {tasks
                                    .filter(t => t.status === 'COMPLETED')
                                    .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
                                    .slice(0, 3)
                                    .map(task => (
                                        <li key={task.id} className="border-l-4 border-green-500 pl-3">
                                            <p className="font-medium text-sm">{task.title}</p>
                                            <p className="text-xs text-gray-600">
                                                Concluída: {new Date(task.completedAt!).toLocaleDateString('pt-BR')}
                                            </p>
                                            {task.timeSpent > 0 && (
                                                <div className="mt-1 flex items-center">
                                                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                                    <p className="text-xs text-gray-700">
                                                        Tempo gasto: {Math.floor(task.timeSpent / 60)} min
                                                    </p>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Dica de Produtividade</h3>
                                <p className="text-indigo-100 text-sm">
                                    {twoMinutesWarningCount > 0
                                        ? "⚠️ Tarefas com menos de 2 minutos! Conclua-as rapidamente!"
                                        : activeTimersCount > 0
                                            ? "Mantenha o foco nas tarefas com cronômetro ativo. O tempo está correndo!"
                                            : tasks.filter(t => t.status === 'PENDING').length > 0
                                                ? "Você tem tarefas pendentes. Defina um tempo estimado para começar!"
                                                : "Excelente trabalho! Todas as tarefas estão organizadas."
                                    }
                                </p>
                            </div>
                            <div className="text-2xl">
                                {twoMinutesWarningCount > 0 ? "⏰" : activeTimersCount > 0 ? "⏱️" : "🎯"}
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <div className="flex-1 h-2 bg-indigo-300 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(tasks.filter(t => t.status === 'COMPLETED').length / Math.max(tasks.length, 1)) * 100}%`
                                    }}
                                />
                            </div>
                            <span className="ml-4 font-medium">
                                {tasks.length > 0
                                    ? `${Math.round((tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100)}%`
                                    : "0%"
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
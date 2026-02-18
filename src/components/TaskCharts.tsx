// src/components/TaskCharts.tsx
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Target, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface Task {
    id: string
    title: string
    description?: string
    status: string
    timeSpent: number // em segundos (não vamos usar)
    estimatedTime?: number // EM MINUTOS - isso que vamos mostrar
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

    // ========== FUNÇÕES AUXILIARES ==========
    const formatMinutes = (minutes?: number): string => {
        if (!minutes || minutes <= 0) return '0min'
        return `${minutes}min`
    }

    // Agrupar tarefas por data de conclusão
    const getTasksByDate = () => {
        const map: Record<string, Task[]> = {}

        tasks.forEach(task => {
            if (task.status === 'COMPLETED' && task.completedAt) {
                try {
                    const date = new Date(task.completedAt)
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

                    if (!map[key]) map[key] = []
                    map[key].push(task)
                } catch (error) {
                    console.error('Erro na data:', error)
                }
            }
        })

        return map
    }

    // Gerar calendário
    const generateCalendar = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const today = new Date()

        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const firstDayIndex = firstDay.getDay()

        const days = []

        // Dias do mês anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate()
        for (let i = 0; i < firstDayIndex; i++) {
            const day = prevMonthLastDay - firstDayIndex + i + 1
            const date = new Date(year, month - 1, day)
            days.push({
                date,
                day,
                isCurrentMonth: false,
                isToday: false
            })
        }

        // Dias do mês atual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()

            days.push({
                date,
                day,
                isCurrentMonth: true,
                isToday
            })
        }

        // Completar com próximo mês (42 dias = 6 semanas)
        const remaining = 42 - days.length
        for (let day = 1; day <= remaining; day++) {
            const date = new Date(year, month + 1, day)
            days.push({
                date,
                day,
                isCurrentMonth: false,
                isToday: false
            })
        }

        return days
    }

    // ========== ESTATÍSTICAS USANDO ESTIMATEDTIME ==========
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length
    const pendingTasks = tasks.filter(t => t.status === 'PENDING').length
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length

    // Tempo total ESTIMADO (em minutos)
    const totalEstimatedTime = tasks.reduce((sum, task) =>
        sum + (task.estimatedTime || 0), 0
    )

    // Tempo médio estimado por tarefa
    const avgEstimatedTime = totalTasks > 0 ? totalEstimatedTime / totalTasks : 0

    // Taxa de conclusão
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Tarefas com maior tempo estimado
    const tasksWithEstimatedTime = tasks
        .filter(task => task.estimatedTime && task.estimatedTime > 0)
        .sort((a, b) => (b.estimatedTime || 0) - (a.estimatedTime || 0))
        .slice(0, 8)

    // ========== MESES E DIAS ==========
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    // ========== RENDERIZAÇÃO ==========
    const calendarDays = generateCalendar()
    const tasksByDate = getTasksByDate()

    return (
        <div className="space-y-6">
            {/* Cartões de Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total de Tarefas</p>
                            <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                        </div>
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Target className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        {pendingTasks} pendentes • {inProgressTasks} em andamento
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {completionRate.toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            {completionRate >= 50 ? (
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            ) : (
                                <TrendingDown className="h-6 w-6 text-red-600" />
                            )}
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        {completedTasks} de {totalTasks} tarefas
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tempo Total Estimado</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatMinutes(totalEstimatedTime)}
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        Média: {formatMinutes(avgEstimatedTime)} por tarefa
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Produtividade do Mês</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {tasks.filter(t =>
                                    t.status === 'COMPLETED' &&
                                    t.completedAt &&
                                    new Date(t.completedAt).getMonth() === currentMonth.getMonth() &&
                                    new Date(t.completedAt).getFullYear() === currentMonth.getFullYear()
                                ).length}
                            </p>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        {currentMonth.toLocaleDateString('pt-BR', { month: 'long' })}
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">Análise de Produtividade</h3>
                    <div className="hidden md:flex space-x-2">
                        <button
                            onClick={() => setActiveTab('progress')}
                            className={`px-4 py-2 text-sm rounded-lg ${activeTab === 'progress' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            📊 Progresso
                        </button>
                        <button
                            onClick={() => setActiveTab('time')}
                            className={`px-4 py-2 text-sm rounded-lg ${activeTab === 'time' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            ⏱️ Tempo Estimado
                        </button>
                        <button
                            onClick={() => setActiveTab('completion')}
                            className={`px-4 py-2 text-sm rounded-lg ${activeTab === 'completion' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            📅 Calendário
                        </button>
                    </div>
                    <div className="md:hidden flex overflow-x-auto pb-2 -mx-6 px-6">
                        <div className="flex space-x-2 min-w-max">
                            <button
                                onClick={() => setActiveTab('progress')}
                                className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap ${activeTab === 'progress' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Progresso
                            </button>
                            <button
                                onClick={() => setActiveTab('time')}
                                className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap ${activeTab === 'time' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Tempo
                            </button>
                            <button
                                onClick={() => setActiveTab('completion')}
                                className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap ${activeTab === 'completion' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Calendário
                            </button>
                        </div>
                    </div>
                </div>

                {activeTab === 'progress' && (
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-6">Status das Tarefas</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                    <div className="flex items-center mb-3">
                                        <div className="h-4 w-4 rounded-full bg-slate-500 mr-3"></div>
                                        <span className="font-medium text-slate-700">Pendentes</span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">{pendingTasks}</div>
                                    <div className="mt-2 text-sm text-slate-600">
                                        {pendingTasks > 0 ? tasks
                                            .filter(t => t.status === 'PENDING')
                                            .reduce((sum, t) => sum + (t.estimatedTime || 0), 0) : 0
                                        }min estimados
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                                    <div className="flex items-center mb-3">
                                        <div className="h-4 w-4 rounded-full bg-indigo-500 mr-3"></div>
                                        <span className="font-medium text-indigo-700">Em Andamento</span>
                                    </div>
                                    <div className="text-3xl font-bold text-indigo-900">{inProgressTasks}</div>
                                    <div className="mt-2 text-sm text-indigo-600">
                                        {inProgressTasks > 0 ? tasks
                                            .filter(t => t.status === 'IN_PROGRESS')
                                            .reduce((sum, t) => sum + (t.estimatedTime || 0), 0) : 0
                                        }min estimados
                                    </div>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <div className="flex items-center mb-3">
                                        <div className="h-4 w-4 rounded-full bg-green-500 mr-3"></div>
                                        <span className="font-medium text-green-700">Concluídas</span>
                                    </div>
                                    <div className="text-3xl font-bold text-green-900">{completedTasks}</div>
                                    <div className="mt-2 text-sm text-green-600">
                                        {completedTasks > 0 ? tasks
                                            .filter(t => t.status === 'COMPLETED')
                                            .reduce((sum, t) => sum + (t.estimatedTime || 0), 0) : 0
                                        }min estimados
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'time' && (
                    <div className="space-y-6">
                        <h4 className="font-medium text-gray-900 mb-4">Tempo Estimado por Tarefa</h4>
                        {tasksWithEstimatedTime.length === 0 ? (
                            <div className="text-center py-8">
                                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Nenhuma tarefa com tempo estimado definido</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tasksWithEstimatedTime.map((task) => (
                                    <div key={task.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 truncate">
                                                    {task.title}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {formatMinutes(task.estimatedTime)}
                                                    {task.status === 'IN_PROGRESS' && task.startedAt && (
                                                        <span className="ml-2 text-indigo-600">● Em andamento</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ml-2 ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                task.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {task.status === 'COMPLETED' ? 'Concluída' :
                                                    task.status === 'IN_PROGRESS' ? 'Em Andamento' : 'Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'completion' && (
                    <div className="space-y-6">
                        {/* Cabeçalho do Calendário - Visível apenas em md+ */}
                        <div className="hidden md:flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                                </button>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {tasks.filter(t =>
                                            t.status === 'COMPLETED' &&
                                            t.completedAt &&
                                            new Date(t.completedAt).getMonth() === currentMonth.getMonth() &&
                                            new Date(t.completedAt).getFullYear() === currentMonth.getFullYear()
                                        ).length} tarefas concluídas
                                    </p>
                                </div>

                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <ChevronRight className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>

                            <button
                                onClick={() => setCurrentMonth(new Date())}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                            >
                                Hoje
                            </button>
                        </div>

                        {/* Mensagem para mobile */}
                        <div className="md:hidden bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-indigo-600 mr-3" />
                                <div>
                                    <p className="font-medium text-indigo-900">Calendário Disponível</p>
                                    <p className="text-sm text-indigo-700">
                                        Visualize o calendário completo em telas maiores (tablet ou desktop)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Calendário - Visível apenas em md+ */}
                        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Dias da semana */}
                            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                                {dayNames.map((day, index) => (
                                    <div key={index} className="p-3 text-center">
                                        <span className={`text-sm font-medium ${index === 0 ? 'text-red-500' : index === 6 ? 'text-indigo-500' : 'text-gray-700'
                                            }`}>
                                            {day}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Dias do mês */}
                            <div className="grid grid-cols-7">
                                {calendarDays.map((day, index) => {
                                    const dateKey = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`
                                    const dayTasks = tasksByDate[dateKey] || []

                                    return (
                                        <div
                                            key={index}
                                            className={`min-h-32 p-2 border border-gray-100 ${!day.isCurrentMonth ? 'bg-gray-50/50' : ''
                                                } ${day.isToday ? 'bg-indigo-50 border-indigo-200' : ''}`}
                                        >
                                            {/* Número do dia */}
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${!day.isCurrentMonth ? 'text-gray-400' : ''
                                                    } ${day.isToday ? 'bg-indigo-600 text-white' : ''}`}>
                                                    {day.day}
                                                </span>

                                                {dayTasks.length > 0 && (
                                                    <span className="text-xs font-semibold bg-green-500 text-white px-2 py-1 rounded-full">
                                                        {dayTasks.length}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Tarefas do dia */}
                                            {dayTasks.length > 0 && (
                                                <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                                                    {dayTasks.slice(0, 3).map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className="text-xs p-1.5 rounded bg-green-50 border border-green-100"
                                                        >
                                                            <div className="font-medium text-green-800 truncate">
                                                                {task.title}
                                                            </div>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span className="text-green-600">
                                                                    {formatMinutes(task.estimatedTime)}
                                                                </span>
                                                                <span className="text-green-500">✓</span>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {dayTasks.length > 3 && (
                                                        <div className="text-xs text-center text-green-600 bg-green-50 p-1 rounded border border-green-100">
                                                            +{dayTasks.length - 3} mais
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Resumo do Mês - Visível em todas as telas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                <div className="flex items-center mb-4">
                                    <Clock className="h-5 w-5 text-indigo-600 mr-3" />
                                    <div className="text-lg font-medium text-indigo-900">Tempo Total do Mês</div>
                                </div>
                                <div className="text-4xl font-bold text-indigo-900 mb-2">
                                    {formatMinutes(
                                        tasks
                                            .filter(t =>
                                                t.status === 'COMPLETED' &&
                                                t.completedAt &&
                                                new Date(t.completedAt).getMonth() === currentMonth.getMonth() &&
                                                new Date(t.completedAt).getFullYear() === currentMonth.getFullYear()
                                            )
                                            .reduce((sum, t) => sum + (t.estimatedTime || 0), 0)
                                    )}
                                </div>
                                <div className="text-sm text-indigo-700">
                                    tempo estimado total
                                </div>
                            </div>

                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <div className="flex items-center mb-4">
                                    <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                                    <div className="text-lg font-medium text-green-900">Dias Produtivos</div>
                                </div>
                                <div className="text-4xl font-bold text-green-900 mb-2">
                                    {Object.keys(tasksByDate).filter(key => {
                                        const date = new Date(key)
                                        return date.getMonth() === currentMonth.getMonth() &&
                                            date.getFullYear() === currentMonth.getFullYear()
                                    }).length}
                                </div>
                                <div className="text-sm text-green-700">
                                    dias com tarefas concluídas
                                </div>
                            </div>
                        </div>

                        {/* Mini versão do calendário para mobile */}
                        <div className="md:hidden bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {monthNames[currentMonth.getMonth()].substring(0, 3)} {currentMonth.getFullYear()}
                                    </h4>
                                    <p className="text-sm text-gray-600">Resumo Mensal</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                        className="p-1 rounded-lg hover:bg-gray-100"
                                    >
                                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                        className="p-1 rounded-lg hover:bg-gray-100"
                                    >
                                        <ChevronRight className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {Object.keys(tasksByDate)
                                    .filter(key => {
                                        const date = new Date(key)
                                        return date.getMonth() === currentMonth.getMonth() &&
                                            date.getFullYear() === currentMonth.getFullYear()
                                    })
                                    .slice(0, 3)
                                    .map(dateKey => (
                                        <div key={dateKey} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(dateKey).getDate()} de {monthNames[new Date(dateKey).getMonth()].substring(0, 3)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {tasksByDate[dateKey].length} tarefa{tasksByDate[dateKey].length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-green-600">
                                                    {formatMinutes(
                                                        tasksByDate[dateKey].reduce((sum, task) => sum + (task.estimatedTime || 0), 0)
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                {Object.keys(tasksByDate).filter(key => {
                                    const date = new Date(key)
                                    return date.getMonth() === currentMonth.getMonth() &&
                                        date.getFullYear() === currentMonth.getFullYear()
                                }).length > 3 && (
                                        <div className="text-center text-sm text-gray-500 py-2">
                                            +{Object.keys(tasksByDate).filter(key => {
                                                const date = new Date(key)
                                                return date.getMonth() === currentMonth.getMonth() &&
                                                    date.getFullYear() === currentMonth.getFullYear()
                                            }).length - 3} dias com tarefas
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
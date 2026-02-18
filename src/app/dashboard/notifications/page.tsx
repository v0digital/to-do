// src/app/dashboard/notifications/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import {
    Bell,
    CheckCircle,
    AlertTriangle,
    Info,
    XCircle,
    Clock,
    Calendar,
    Check
} from 'lucide-react'

interface Notification {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    taskId?: string
    createdAt: string
}

export default function NotificationsPage() {
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        loadNotifications()
    }, [])

    const loadNotifications = async () => {
        try {
            const response = await fetch('/api/notifications')
            if (response.status === 401) {
                toast.error('Sessão expirada')
                router.push('/auth/login')
                return
            }

            const data = await response.json()
            setNotifications(data.notifications || [])
        } catch (error) {
            console.error('Error loading notifications:', error)
            toast.error('Erro ao carregar notificações')
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}/read`, {
                method: 'POST'
            })

            if (response.ok) {
                setNotifications(notifications.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                ))
                toast.success('Notificação marcada como lida')
            }
        } catch (error) {
            console.error('Error marking as read:', error)
            toast.error('Erro ao marcar como lida')
        }
    }

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/api/notifications/read-all', {
                method: 'POST'
            })

            if (response.ok) {
                setNotifications(notifications.map(notif => ({ ...notif, read: true })))
                toast.success('Todas as notificações marcadas como lidas')
            }
        } catch (error) {
            console.error('Error marking all as read:', error)
            toast.error('Erro ao marcar todas como lidas')
        }
    }

    const deleteNotification = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setNotifications(notifications.filter(notif => notif.id !== id))
                toast.success('Notificação excluída')
            }
        } catch (error) {
            console.error('Error deleting notification:', error)
            toast.error('Erro ao excluir notificação')
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />
            case 'info':
            default:
                return <Info className="h-5 w-5 text-indigo-500" />
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'success': return 'Sucesso'
            case 'warning': return 'Aviso'
            case 'error': return 'Erro'
            case 'info': return 'Informação'
            default: return type
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffHours < 1) {
            return 'Há alguns minutos'
        } else if (diffHours < 24) {
            return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
        } else if (diffDays < 7) {
            return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
        } else {
            return date.toLocaleDateString('pt-BR')
        }
    }

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true
        if (filter === 'unread') return !notif.read
        return true
    })

    const unreadCount = notifications.filter(n => !n.read).length

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Carregando...</div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
                        <p className="text-gray-600 mt-2">
                            Gerencie seus alertas e notificações
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            ← Voltar
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Todas ({notifications.length})
                                    </button>
                                    <button
                                        onClick={() => setFilter('unread')}
                                        className={`px-4 py-2 rounded-md ${filter === 'unread' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Não lidas ({unreadCount})
                                    </button>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="flex items-center px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Marcar todas como lidas
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {filteredNotifications.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Nenhuma notificação
                                    </h3>
                                    <p className="text-gray-600">
                                        {filter === 'unread'
                                            ? 'Você não tem notificações não lidas'
                                            : 'Você não tem notificações'
                                        }
                                    </p>
                                </div>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-6 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50' : ''}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-800' :
                                                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                                notification.type === 'error' ? 'bg-red-100 text-red-800' :
                                                                    'bg-indigo-100 text-indigo-800'
                                                            }`}>
                                                            {getTypeLabel(notification.type)}
                                                        </span>

                                                        {!notification.read && (
                                                            <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                                                Nova
                                                            </span>
                                                        )}

                                                        <span className="text-sm text-gray-500">
                                                            <Clock className="inline h-3 w-3 mr-1" />
                                                            {formatDate(notification.createdAt)}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-medium text-gray-900 mb-1">
                                                        {notification.title}
                                                    </h3>

                                                    <p className="text-gray-600">
                                                        {notification.message}
                                                    </p>

                                                    {notification.taskId && (
                                                        <Link
                                                            href={`/dashboard/tasks/${notification.taskId}`}
                                                            className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                                                        >
                                                            Ver tarefa relacionada →
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 ml-4">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-1 text-gray-400 hover:text-gray-600"
                                                        title="Marcar como lida"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600"
                                                    title="Excluir notificação"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-medium">{notifications.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Não lidas:</span>
                                <span className="font-medium text-indigo-600">{unreadCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Lidas:</span>
                                <span className="font-medium">{notifications.length - unreadCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tipos</h3>
                        <div className="space-y-3">
                            {[
                                { type: 'info', label: 'Informação', count: notifications.filter(n => n.type === 'info').length },
                                { type: 'warning', label: 'Avisos', count: notifications.filter(n => n.type === 'warning').length },
                                { type: 'success', label: 'Sucessos', count: notifications.filter(n => n.type === 'success').length },
                                { type: 'error', label: 'Erros', count: notifications.filter(n => n.type === 'error').length }
                            ].map((typeInfo) => (
                                <div key={typeInfo.type} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        {getNotificationIcon(typeInfo.type)}
                                        <span className="ml-2 text-gray-700">{typeInfo.label}</span>
                                    </div>
                                    <span className="font-medium">{typeInfo.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                                        defaultChecked
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Notificações por email
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                                        defaultChecked
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Lembretes de tarefas
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                                        defaultChecked
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Alertas de tempo
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
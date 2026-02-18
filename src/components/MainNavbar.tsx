// src/components/MainNavbar.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CalendarCheck, Bell, LogOut, User, CheckCircle, AlertTriangle, Info, XCircle, Clock } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface Notification {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    createdAt: string
    taskId?: string
}

export default function MainNavbar() {
    const router = useRouter()
    const [userName, setUserName] = useState('Usuário')
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showNotifications, setShowNotifications] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (res.ok) {
                    const data = await res.json()
                    if (data && data.email) {
                        setUserName(data.name || data.email.split('@')[0] || 'Usuário')
                    }
                } else {
                    console.warn('Failed to fetch user data')
                }
            } catch (error) {
                console.error('Error fetching user:', error)
                setUserName('Usuário')
            }
        }
        fetchUser()

        loadNotifications()
    }, [])

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false)
            }
        }

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showNotifications])

    const loadNotifications = async () => {
        try {
            const res = await fetch('/api/notifications')
            if (res.ok) {
                const data = await res.json()
                setNotifications(data.notifications || [])
            }
        } catch (error) {
            console.error('Error loading notifications:', error)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            toast.success('Sessão encerrada com sucesso')
            router.push('/auth/login')
        } catch (error) {
            console.error('Error logging out:', error)
            toast.error('Erro ao sair')
        }
    }

    const handleNotificationsClick = () => {
        setShowNotifications(!showNotifications)
        if (showNotifications === false) {
            loadNotifications() // Recarregar quando abrir
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
            }
        } catch (error) {
            console.error('Error marking as read:', error)
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
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case 'error':
                return <XCircle className="h-4 w-4 text-red-500" />
            case 'info':
            default:
                return <Info className="h-4 w-4 text-indigo-500" />
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffHours < 1) {
            return 'Agora'
        } else if (diffHours < 24) {
            return `Há ${diffHours}h`
        } else if (diffDays < 7) {
            return `Há ${diffDays}d`
        } else {
            return date.toLocaleDateString('pt-BR')
        }
    }

    const unreadNotifications = notifications.filter(n => !n.read).length
    const recentNotifications = notifications.slice(0, 5) // Mostrar apenas 5 mais recentes

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="flex items-center space-x-3 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-indigo-600">
                                <CalendarCheck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-gray-900">TaskFlow</span>
                                <span className="ml-1 text-xs font-medium text-indigo-600">PRO</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1">
                            <div className="h-8 w-px bg-gray-200" />
                            <span className="ml-4 text-sm font-medium text-gray-600">Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={handleNotificationsClick}
                                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown de notificações */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                                            {unreadNotifications > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-indigo-600 hover:text-indigo-700"
                                                >
                                                    Marcar todas como lidas
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {recentNotifications.length === 0 ? (
                                            <div className="px-4 py-8 text-center">
                                                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">Nenhuma notificação</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100">
                                                {recentNotifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50' : ''}`}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className="mt-0.5">
                                                                {getNotificationIcon(notification.type)}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                                        {notification.title}
                                                                    </p>
                                                                    <div className="flex items-center space-x-2 ml-2">
                                                                        {!notification.read && (
                                                                            <button
                                                                                onClick={() => markAsRead(notification.id)}
                                                                                className="text-xs text-gray-400 hover:text-gray-600"
                                                                                title="Marcar como lida"
                                                                            >
                                                                                ✓
                                                                            </button>
                                                                        )}
                                                                        <span className="text-xs text-gray-500">
                                                                            <Clock className="inline h-3 w-3 mr-1" />
                                                                            {formatDate(notification.createdAt)}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {notification.message}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-4 py-2 border-t border-gray-200">
                                        <Link
                                            href="/dashboard/notifications"
                                            className="text-sm text-indigo-600 hover:text-indigo-700 text-center block py-2 hover:bg-gray-50 rounded"
                                            onClick={() => setShowNotifications(false)}
                                        >
                                            Ver todas as notificações
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden sm:flex items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-indigo-500">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500">Plano Free</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
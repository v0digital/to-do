// src/components/MainNavbar.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CalendarCheck, Bell, LogOut, User, CheckCircle, AlertTriangle, Info, XCircle, Clock, ChevronDown } from 'lucide-react'
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
                }
            } catch (error) {
                console.error('Error fetching user:', error)
            }
        }
        fetchUser()
        loadNotifications()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false)
            }
        }
        if (showNotifications) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
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
            toast.success('Sessão encerrada')
            router.push('/login')
        } catch (error) {
            toast.error('Erro ao sair')
        }
    }

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
            if (response.ok) {
                setNotifications(notifications.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                ))
            }
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />
            case 'error': return <XCircle className="h-4 w-4 text-red-500" />
            default: return <Info className="h-4 w-4 text-gray-400" />
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const diffHours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60))
        if (diffHours < 1) return 'Agora'
        if (diffHours < 24) return `${diffHours}h`
        return date.toLocaleDateString('pt-BR')
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-gray-800 to-gray-950 shadow-lg dark:from-gray-50 dark:to-gray-200">
                                <CalendarCheck className="h-5 w-5 text-white dark:text-gray-950" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-50">v0 Digital</span>
                                <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-200 uppercase">SaaS Pro</span>
                            </div>
                        </Link>
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) loadNotifications(); }}
                                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-all hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-950">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-200 bg-white py-2 shadow-2xl dark:border-gray-800 dark:bg-gray-950 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-900">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Notificações</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-sm text-gray-400">Sem novas notificações</div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => !n.read && markAsRead(n.id)}
                                                    className={`group relative flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 ${!n.read ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''}`}
                                                >
                                                    <div className="mt-1">{getNotificationIcon(n.type)}</div>
                                                    <div className="flex flex-1 flex-col">
                                                        <span className={`text-sm font-semibold ${n.read ? 'text-gray-500' : 'text-gray-800 dark:text-gray-50'}`}>{n.title}</span>
                                                        <span className="text-xs text-gray-400 line-clamp-2">{n.message}</span>
                                                        <span className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                                                            <Clock size={10} /> {formatDate(n.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="border-t border-gray-100 p-2 dark:border-gray-900">
                                        <Link href="/dashboard/notifications" className="block rounded-lg py-2 text-center text-xs font-bold text-gray-800 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-900">
                                            Ver Histórico Completo
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900">
                                <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="hidden flex-col sm:flex">
                                <span className="text-xs font-bold text-gray-800 dark:text-gray-50">{userName}</span>
                                <span className="text-[10px] font-medium text-gray-400">Plano Enterprise</span>
                            </div>
                            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
                            <button
                                onClick={handleLogout}
                                title="Sair do sistema"
                                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
// src/components/NotificationSound.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Bell, BellRing, CheckCircle2, ShieldAlert, X } from 'lucide-react'

interface NotificationSoundProps {
    playSound: boolean
    title?: string
    message?: string
    soundType?: 'alert' | 'warning' | 'success'
}

export default function NotificationSound({
    playSound,
    title = "v0 Digital",
    message = "Alerta de sistema",
    soundType = 'alert'
}: NotificationSoundProps) {
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [hasPlayed, setHasPlayed] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [userHasInteracted, setUserHasInteracted] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const soundUrls = {
        alert: '/audio/alert.mp3',
        warning: '/audio/warning.mp3',
        success: '/audio/success.mp3'
    }

    useEffect(() => {
        setIsClient(true)
        const handleInteraction = () => {
            setUserHasInteracted(true)
            document.removeEventListener('click', handleInteraction)
            document.removeEventListener('keydown', handleInteraction)
        }
        document.addEventListener('click', handleInteraction)
        document.addEventListener('keydown', handleInteraction)
        return () => {
            document.removeEventListener('click', handleInteraction)
            document.removeEventListener('keydown', handleInteraction)
        }
    }, [])

    const initializeAudio = useCallback(() => {
        if (!isClient || audioRef.current) return
        try {
            audioRef.current = new Audio(soundUrls[soundType])
            audioRef.current.preload = 'auto'
            audioRef.current.volume = 0.6
            audioRef.current.load()
        } catch (error) {
            console.error('Audio init error:', error)
        }
    }, [isClient, soundType])

    useEffect(() => {
        if (isClient && 'Notification' in window) {
            setPermission(Notification.permission)
            initializeAudio()
        }
    }, [isClient, initializeAudio])

    const requestPermission = () => {
        if (!isClient || !('Notification' in window)) return
        Notification.requestPermission().then((result) => {
            setPermission(result)
            if (result === 'granted') {
                toast.success('Notificações ativadas com sucesso')
            }
        })
    }

    const playAudio = useCallback(() => {
        if (!isClient || !audioRef.current) return
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {
            const fallback = new Audio(soundUrls[soundType])
            fallback.volume = 0.6
            fallback.play().catch(() => { })
        })
    }, [isClient, soundType])

    useEffect(() => {
        if (!isClient || !playSound || hasPlayed) return
        const canNotify = userHasInteracted || permission === 'granted'

        if (canNotify) {
            if (permission === 'granted') {
                new Notification(title, { body: message, silent: true })
            }
            playAudio()
            setHasPlayed(true)
            setTimeout(() => setHasPlayed(false), 3000)
        } else if (playSound) {
            toast.warning('Clique na página para ativar os alertas sonoros.')
        }
    }, [playSound, isClient, userHasInteracted, permission, hasPlayed, playAudio, title, message])

    if (!isClient || !isVisible) return null

    // Layout para Solicitação de Permissão (Minimalista v0)
    if (permission !== 'granted') {
        return (
            <div className="fixed bottom-6 left-6 z-50 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 dark:hover:text-gray-50"
                    >
                        <X size={16} />
                    </button>
                    <div className="flex flex-col gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
                            <BellRing size={20} className="text-gray-800 dark:text-gray-50" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-50">Alertas de Sistema</h3>
                            <p className="mt-1 text-xs leading-relaxed text-gray-400 dark:text-gray-200">
                                Ative as notificações para receber alertas em tempo real sobre suas tarefas.
                            </p>
                        </div>
                        <button
                            onClick={requestPermission}
                            className="w-full rounded-xl bg-gray-800 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-950 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200"
                        >
                            Permitir Notificações
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Status Ativo (Discreto)
    return (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/80 px-3 py-2 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 shadow-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/10">
                    <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sistema</span>
                    <span className="text-[11px] font-bold text-gray-800 dark:text-gray-50">
                        {userHasInteracted ? 'Sons Ativos' : 'Clique para ativar áudio'}
                    </span>
                </div>
            </div>
        </div>
    )
}
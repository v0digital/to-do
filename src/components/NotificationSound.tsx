// src/components/NotificationSound.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface NotificationSoundProps {
    playSound: boolean
    title?: string
    message?: string
    soundType?: 'alert' | 'warning' | 'success'
}

export default function NotificationSound({
    playSound,
    title = "TaskFlow",
    message = "Alerta de tempo",
    soundType = 'alert'
}: NotificationSoundProps) {
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [hasPlayed, setHasPlayed] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [userHasInteracted, setUserHasInteracted] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // URLs dos sons
    const soundUrls = {
        alert: '/audio/alert.mp3',
        warning: '/audio/warning.mp3',
        success: '/audio/success.mp3'
    }

    // Inicializar no cliente
    useEffect(() => {
        setIsClient(true)

        // Verificar se usuário já interagiu (para áudio automático)
        const handleUserInteraction = () => {
            setUserHasInteracted(true)
            // Remover listeners após primeira interação
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('keydown', handleUserInteraction)
            document.removeEventListener('touchstart', handleUserInteraction)
        }

        document.addEventListener('click', handleUserInteraction)
        document.addEventListener('keydown', handleUserInteraction)
        document.addEventListener('touchstart', handleUserInteraction)

        return () => {
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('keydown', handleUserInteraction)
            document.removeEventListener('touchstart', handleUserInteraction)
        }
    }, [])

    // Inicializar elemento de áudio
    const initializeAudio = useCallback(() => {
        if (!isClient || audioRef.current) return

        try {
            audioRef.current = new Audio(soundUrls[soundType])
            audioRef.current.preload = 'auto'
            audioRef.current.volume = 0.8

            // Tentar carregar o áudio
            audioRef.current.load()
        } catch (error) {
            console.error('Error initializing audio:', error)
        }
    }, [isClient, soundType])

    // Verificar permissão ao carregar
    useEffect(() => {
        if (isClient && 'Notification' in window) {
            setPermission(Notification.permission)
            initializeAudio()
        }
    }, [isClient, initializeAudio])

    // Solicitar permissão
    const requestPermission = () => {
        if (!isClient || !('Notification' in window)) {
            alert('Seu navegador não suporta notificações')
            return
        }

        Notification.requestPermission().then((result) => {
            setPermission(result)
            if (result === 'granted') {
                // Criar uma notificação de teste
                try {
                    const testNotification = new Notification('Notificações ativadas!', {
                        body: 'Você receberá alertas sonoros para tarefas com 2 minutos restantes.',
                        icon: '/icon.png',
                        requireInteraction: false
                    })

                    setTimeout(() => testNotification.close(), 3000)
                } catch (error) {
                    console.error('Error creating test notification:', error)
                }
            }
        })
    }

    // Função para tocar som
    const playAudio = useCallback(() => {
        if (!isClient) return

        try {
            // Método 1: Usar audioRef atualizado
            if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.play().catch(error => {
                    console.log('Audio play failed, trying fallback:', error)

                    // Método 2: Criar novo elemento de áudio
                    const newAudio = new Audio(soundUrls[soundType])
                    newAudio.volume = 0.8
                    newAudio.play().catch(console.error)

                    // Método 3: Se falhar, tentar com volume 0 e depois ajustar (truque para Chrome)
                    setTimeout(() => {
                        const trickAudio = new Audio(soundUrls[soundType])
                        trickAudio.volume = 0.01
                        trickAudio.play().then(() => {
                            trickAudio.volume = 0.8
                        }).catch(console.error)
                    }, 100)
                })
            } else {
                // Se audioRef não existe, criar novo
                const audio = new Audio(soundUrls[soundType])
                audio.volume = 0.8
                audio.play().catch(console.error)
            }
        } catch (error) {
            console.error('Error playing audio:', error)
        }
    }, [isClient, soundType])

    // Função para mostrar notificação
    const showNotification = useCallback(() => {
        if (!isClient || !('Notification' in window) || permission !== 'granted') return

        try {
            const notification = new Notification(title, {
                body: message,
                icon: '/icon.png',
                tag: 'taskflow-alert-' + Date.now(),
                requireInteraction: false,
                silent: true // Notificação silenciosa, som é controlado separadamente
            })

            notification.onclick = () => {
                window.focus()
                notification.close()
            }

            setTimeout(() => {
                notification.close()
            }, 5000)

            return notification
        } catch (error) {
            console.error('Error creating notification:', error)
            return null
        }
    }, [isClient, permission, title, message])

    // Tocar notificação quando playSound for true
    useEffect(() => {
        if (!isClient || !playSound || hasPlayed) return

        // Só tocar se usuário já interagiu OU se tem permissão de notificação
        const canPlaySound = userHasInteracted || permission === 'granted'

        if (canPlaySound) {
            console.log('🔔 Tentando tocar notificação:', {
                playSound,
                userHasInteracted,
                permission,
                hasPlayed
            })

            // 1. Mostrar notificação visual (se permitido)
            if (permission === 'granted') {
                showNotification()
            }

            // 2. Tocar som
            playAudio()

            // 3. Marcar como tocado
            setHasPlayed(true)

            // Resetar após 3 segundos
            setTimeout(() => {
                setHasPlayed(false)
            }, 3000)
        } else {
            console.log('🔕 Som não tocado - usuário não interagiu e não tem permissão')

            // Se não pode tocar, mostrar aviso visual
            if (playSound) {
                toast.warning('🔔 Alerta: Tarefa com menos de 2 minutos! Clique na página para ativar sons.')
            }
        }
    }, [playSound, isClient, userHasInteracted, permission, hasPlayed, playAudio, showNotification])

    // Resetar hasPlayed quando playSound for false
    useEffect(() => {
        if (!playSound) {
            setHasPlayed(false)
        }
    }, [playSound])

    // Se não está no cliente, não renderizar
    if (!isClient) {
        return null
    }

    // Se não tem permissão, mostrar botão para solicitar
    if (permission !== 'granted') {
        return (
            <div className="fixed bottom-4 left-4 z-50 bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-lg max-w-sm animate-fade-in">
                <div className="flex items-start">
                    <div className="shrink-0">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-indigo-800">
                            🔔 Permitir Notificações
                        </h3>
                        <div className="mt-2 text-sm text-indigo-700">
                            <p>
                                Para receber alertas visuais quando tarefas estiverem com 2 minutos restantes.
                            </p>
                            <p className="mt-1 text-xs text-indigo-600">
                                <strong>Importante:</strong> Clique em qualquer lugar da página para ativar sons automáticos.
                            </p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={requestPermission}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                {permission === 'default' ? 'Permitir Notificações' : 'Permitir Novamente'}
                            </button>

                            {!userHasInteracted && (
                                <p className="mt-2 text-xs text-indigo-600">
                                    💡 <strong>Dica:</strong> Clique em qualquer lugar da página para sons automáticos funcionarem.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Se tem permissão, mostrar status
    return (
        <div className="fixed bottom-4 left-4 z-50 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg max-w-sm">
            <div className="flex items-center">
                <div className="shrink-0">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="ml-2">
                    <p className="text-xs font-medium text-green-800">
                        Notificações ativas
                    </p>
                    <p className="text-xs text-green-600">
                        {userHasInteracted ? '✅ Sons automáticos ativados' : '⚠️ Clique na página para sons'}
                    </p>
                </div>
            </div>
        </div>
    )
}

// Adicione esta função toast.warning se não existir (ou use sonner)
import { toast } from 'sonner'
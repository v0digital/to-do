// src/components/TimerSound.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface TimerSoundProps {
    playSound: boolean
    onSoundPlayed?: () => void
    soundType?: 'alert' | 'warning' | 'success'
}

export default function TimerSound({ playSound, onSoundPlayed, soundType = 'alert' }: TimerSoundProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [hasPlayed, setHasPlayed] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    // URLs dos sons (usando sons do sistema ou URLs externas)
    const soundUrls = {
        alert: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3',
        warning: 'https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-765.mp3',
        success: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'
    }

    // Carregar preferência de som do localStorage
    useEffect(() => {
        const savedMute = localStorage.getItem('timerSoundMuted')
        if (savedMute === 'true') {
            setIsMuted(true)
        }
    }, [])

    // Tocar som quando playSound for true
    useEffect(() => {
        if (playSound && audioRef.current && !isMuted && !hasPlayed) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(error => {
                console.log('Autoplay prevented:', error)
                // Tentar tocar após interação do usuário
                document.addEventListener('click', playAudioOnInteraction, { once: true })
            })

            setHasPlayed(true)
            if (onSoundPlayed) {
                onSoundPlayed()
            }
        }

        if (!playSound) {
            setHasPlayed(false)
        }

        function playAudioOnInteraction() {
            if (audioRef.current && playSound && !isMuted) {
                audioRef.current.play().catch(console.error)
            }
        }

        return () => {
            document.removeEventListener('click', playAudioOnInteraction)
        }
    }, [playSound, isMuted, hasPlayed, onSoundPlayed])

    // Salvar preferência de mute
    const toggleMute = () => {
        const newMuteState = !isMuted
        setIsMuted(newMuteState)
        localStorage.setItem('timerSoundMuted', newMuteState.toString())
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Áudio elements */}
            <audio
                ref={audioRef}
                preload="auto"
                src={soundUrls[soundType]}
            >
                <source src={soundUrls[soundType]} type="audio/mpeg" />
                Seu navegador não suporta o elemento de áudio.
            </audio>

            {/* Botão de controle de som */}
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-3 py-2 border border-gray-200">
                <button
                    onClick={toggleMute}
                    className={`p-1 rounded-full ${isMuted ? 'bg-gray-200' : 'bg-indigo-100'}`}
                    title={isMuted ? 'Ativar sons' : 'Desativar sons'}
                >
                    {isMuted ? (
                        <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m4.5-15.5a13 13 0 010 19.5M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    )}
                </button>

                <span className="text-xs text-gray-600">
                    {isMuted ? 'Sons desativados' : 'Sons ativos'}
                </span>
            </div>
        </div>
    )
}
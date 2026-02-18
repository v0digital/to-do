// src/components/TimerSound.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Settings } from 'lucide-react'

interface TimerSoundProps {
    playSound: boolean
    onSoundPlayed?: () => void
    soundType?: 'alert' | 'warning' | 'success'
}

export default function TimerSound({
    playSound,
    onSoundPlayed,
    soundType = 'alert'
}: TimerSoundProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [hasPlayed, setHasPlayed] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isClient, setIsClient] = useState(false)

    const soundUrls = {
        alert: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3',
        warning: 'https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-765.mp3',
        success: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'
    }

    useEffect(() => {
        setIsClient(true)
        const savedMute = localStorage.getItem('v0_timer_muted')
        if (savedMute === 'true') setIsMuted(true)
    }, [])

    useEffect(() => {
        if (playSound && audioRef.current && !isMuted && !hasPlayed) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => {
                const playOnInteraction = () => {
                    audioRef.current?.play().catch(() => { })
                    document.removeEventListener('click', playOnInteraction)
                }
                document.addEventListener('click', playOnInteraction)
            })

            setHasPlayed(true)
            if (onSoundPlayed) onSoundPlayed()
        }

        if (!playSound) setHasPlayed(false)
    }, [playSound, isMuted, hasPlayed, onSoundPlayed])

    const toggleMute = () => {
        const newState = !isMuted
        setIsMuted(newState)
        localStorage.setItem('v0_timer_muted', newState.toString())
    }

    if (!isClient) return null

    return (
        <div className="fixed right-6 bottom-6 z-50">
            <audio ref={audioRef} preload="auto" src={soundUrls[soundType]} />

            <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white/80 p-1.5 pr-4 shadow-xl backdrop-blur-md transition-all dark:border-gray-800 dark:bg-gray-950/80">
                <button
                    onClick={toggleMute}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${isMuted
                            ? 'bg-gray-100 text-gray-400 dark:bg-gray-900'
                            : 'bg-gray-800 text-white dark:bg-gray-50 dark:text-gray-950 shadow-lg'
                        }`}
                    title={isMuted ? 'Ativar alertas sonoros' : 'Silenciar sistema'}
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-200">
                        Áudio {isMuted ? 'Mudo' : 'Ativo'}
                    </span>
                    <span className="mt-0.5 text-[11px] font-bold text-gray-800 dark:text-gray-50">
                        {isMuted ? 'Alertas Silenciados' : 'Sons do Sistema'}
                    </span>
                </div>

                <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900">
                    <Settings size={10} className="text-gray-400 animate-spin-slow" />
                </div>
            </div>
        </div>
    )
}
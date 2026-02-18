// src/components/TaskTimer.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatTimeRemaining, getTimeColor } from '@/lib/utils'
import { Clock, AlertTriangle, Timer, Zap, Hourglass } from 'lucide-react'

interface TaskTimerProps {
    taskId: string
    startedAt?: string
    estimatedTime?: number // em minutos
    onTimeExpired?: () => void
    onTwoMinutesWarning?: () => void
}

export default function TaskTimer({
    taskId,
    startedAt,
    estimatedTime,
    onTimeExpired,
    onTwoMinutesWarning
}: TaskTimerProps) {
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
    const [isExpired, setIsExpired] = useState(false)
    const [showTwoMinutesWarning, setShowTwoMinutesWarning] = useState(false)
    const [hasPlayedTwoMinuteSound, setHasPlayedTwoMinuteSound] = useState(false)
    const [lastPlayedTime, setLastPlayedTime] = useState<number>(0)

    const calculateRemainingTime = useCallback(() => {
        if (!startedAt || !estimatedTime) return 0
        const startTime = new Date(startedAt).getTime()
        const totalEstimatedSeconds = estimatedTime * 60
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
        return Math.max(0, totalEstimatedSeconds - elapsedSeconds)
    }, [startedAt, estimatedTime])

    const checkTwoMinutesWarning = useCallback((seconds: number) => {
        if (seconds <= 120 && seconds > 0) {
            const now = Date.now()
            if (!hasPlayedTwoMinuteSound || now - lastPlayedTime > 30000) {
                setShowTwoMinutesWarning(true)
                setHasPlayedTwoMinuteSound(true)
                setLastPlayedTime(now)
                if (onTwoMinutesWarning) onTwoMinutesWarning()
            }
            return true
        }
        if (seconds > 120) {
            setShowTwoMinutesWarning(false)
            setHasPlayedTwoMinuteSound(false)
        }
        return false
    }, [hasPlayedTwoMinuteSound, lastPlayedTime, onTwoMinutesWarning])

    useEffect(() => {
        if (!startedAt || !estimatedTime) return
        const initialRemaining = calculateRemainingTime()
        setRemainingSeconds(initialRemaining)
        setIsExpired(initialRemaining <= 0)
        checkTwoMinutesWarning(initialRemaining)

        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                const newRemaining = Math.max(0, prev - 1)
                checkTwoMinutesWarning(newRemaining)
                if (newRemaining === 0 && prev > 0) {
                    setIsExpired(true)
                    setShowTwoMinutesWarning(false)
                    if (onTimeExpired) onTimeExpired()
                }
                return newRemaining
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [startedAt, estimatedTime, calculateRemainingTime, onTimeExpired, checkTwoMinutesWarning])

    if (!estimatedTime || !startedAt) return null

    const totalSeconds = estimatedTime * 60
    const timeColor = getTimeColor(remainingSeconds, totalSeconds)
    const progressPercentage = Math.max(0, (remainingSeconds / totalSeconds) * 100)

    return (
        <div className={`mt-4 overflow-hidden rounded-2xl border transition-all duration-500 ${showTwoMinutesWarning ? 'border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-950/20 animate-pulse' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950'}`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${showTwoMinutesWarning ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-50'}`}>
                            {showTwoMinutesWarning ? <AlertTriangle size={20} /> : <Timer size={20} />}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-50 uppercase tracking-tight">Cronômetro Ativo</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tempo de foco</p>
                        </div>
                    </div>
                    <div className={`font-mono text-3xl font-black tracking-tighter ${showTwoMinutesWarning ? 'text-red-600' : 'text-gray-800 dark:text-gray-50'}`}>
                        {formatTimeRemaining(remainingSeconds)}
                    </div>
                </div>

                {/* Progress Bar System */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <span>Progresso da Tarefa</span>
                        <span className={showTwoMinutesWarning ? 'text-red-600' : ''}>
                            {Math.floor(remainingSeconds / 60)}m {remainingSeconds % 60}s restantes
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-900">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${showTwoMinutesWarning ? 'bg-red-500' : progressPercentage > 50 ? 'bg-green-500' : progressPercentage > 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Status Badges */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {showTwoMinutesWarning && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-red-500 px-2 py-1 text-[9px] font-black uppercase tracking-tighter text-white">
                            <Zap size={10} /> Alerta Crítico
                        </div>
                    )}
                    {isExpired ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-2 py-1 text-[9px] font-black uppercase tracking-tighter text-white dark:bg-gray-50 dark:text-gray-950">
                            Tempo Esgotado
                        </div>
                    ) : (
                        <div className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-tighter ${remainingSeconds <= totalSeconds * 0.2 ? 'bg-red-50 text-red-600 dark:bg-red-500/10' :
                                remainingSeconds <= totalSeconds * 0.5 ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' :
                                    'bg-green-50 text-green-600 dark:bg-green-500/10'
                            }`}>
                            <Hourglass size={10} />
                            {remainingSeconds <= totalSeconds * 0.2 ? 'Fase Final' : remainingSeconds <= totalSeconds * 0.5 ? 'Metade Concluída' : 'Em Execução'}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 px-2 py-1 text-[9px] font-black uppercase tracking-tighter text-gray-400 dark:border-gray-800">
                        {Math.floor((totalSeconds - remainingSeconds) / 60)}m utilizados
                    </div>
                </div>
            </div>

            {/* Warning Footer Section */}
            {showTwoMinutesWarning && (
                <div className="bg-red-500 px-4 py-2 dark:bg-red-600">
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white">
                        Conclua a tarefa agora ou ajuste o cronograma
                    </p>
                </div>
            )}
        </div>
    )
}
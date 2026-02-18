// src/components/TaskTimer.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { getRemainingTime, formatTimeRemaining, getTimeColor } from '@/lib/utils'

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

    // Calcular o tempo restante inicial
    const calculateRemainingTime = useCallback(() => {
        if (!startedAt || !estimatedTime) return 0

        const startTime = new Date(startedAt).getTime()
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - startTime) / 1000)
        const totalEstimatedSeconds = estimatedTime * 60

        return Math.max(0, totalEstimatedSeconds - elapsedSeconds)
    }, [startedAt, estimatedTime])

    // Verificar se está nos 2 minutos finais
    const checkTwoMinutesWarning = useCallback((seconds: number) => {
        if (seconds <= 120 && seconds > 0) { // ≤ 2 minutos e > 0 segundos
            const now = Date.now()

            // Tocar som apenas uma vez a cada 30 segundos para evitar spam
            if (!hasPlayedTwoMinuteSound || now - lastPlayedTime > 30000) {
                setShowTwoMinutesWarning(true)
                setHasPlayedTwoMinuteSound(true)
                setLastPlayedTime(now)

                if (onTwoMinutesWarning) {
                    onTwoMinutesWarning()
                }
            }
            return true
        }

        // Resetar o aviso se o tempo voltou para mais de 2 minutos
        if (seconds > 120) {
            setShowTwoMinutesWarning(false)
            setHasPlayedTwoMinuteSound(false)
        }

        return false
    }, [hasPlayedTwoMinuteSound, lastPlayedTime, onTwoMinutesWarning])

    // Atualizar o contador a cada segundo
    useEffect(() => {
        if (!startedAt || !estimatedTime) return

        // Configurar tempo inicial
        const initialRemaining = calculateRemainingTime()
        setRemainingSeconds(initialRemaining)
        setIsExpired(initialRemaining <= 0)

        // Verificar aviso de 2 minutos no início
        checkTwoMinutesWarning(initialRemaining)

        // Configurar intervalo para atualizar a cada segundo
        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                const newRemaining = Math.max(0, prev - 1)

                // Verificar aviso de 2 minutos
                checkTwoMinutesWarning(newRemaining)

                // Verificar se acabou o tempo
                if (newRemaining === 0 && prev > 0) {
                    setIsExpired(true)
                    setShowTwoMinutesWarning(false)
                    if (onTimeExpired) {
                        onTimeExpired()
                    }
                }

                return newRemaining
            })
        }, 1000)

        // Limpar intervalo quando o componente desmontar
        return () => clearInterval(interval)
    }, [startedAt, estimatedTime, calculateRemainingTime, onTimeExpired, checkTwoMinutesWarning])

    // Se não há tempo estimado ou a tarefa não foi iniciada, não mostrar cronômetro
    if (!estimatedTime || !startedAt) {
        return null
    }

    const totalSeconds = estimatedTime * 60
    const timeColor = getTimeColor(remainingSeconds, totalSeconds)
    const progressPercentage = Math.max(0, (remainingSeconds / totalSeconds) * 100)

    return (
        <div className={`mt-4 p-3 rounded-lg border ${showTwoMinutesWarning ? 'bg-linear-to-r from-red-50 to-orange-50 border-red-200 animate-pulse' : 'bg-linear-to-r from-gray-50 to-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full ${showTwoMinutesWarning ? 'bg-red-100' : 'bg-indigo-100'} flex items-center justify-center mr-3`}>
                        {showTwoMinutesWarning ? (
                            <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Contagem Regressiva</h4>
                        <p className="text-xs text-gray-500">Tempo restante para conclusão</p>
                    </div>
                </div>

                <div className={`text-2xl font-bold font-mono ${timeColor} ${showTwoMinutesWarning ? 'animate-pulse' : ''}`}>
                    {formatTimeRemaining(remainingSeconds)}
                </div>
            </div>

            {/* Barra de progresso */}
            <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Tempo restante</span>
                    <span className={`font-medium ${remainingSeconds <= 120 ? 'text-red-600' : ''}`}>
                        {Math.floor(remainingSeconds / 60)} min {remainingSeconds % 60}s
                    </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${showTwoMinutesWarning ? 'bg-red-500' : progressPercentage > 50 ? 'bg-green-500' : progressPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 min</span>
                    <span>{estimatedTime} min (total)</span>
                </div>
            </div>

            {/* Indicadores de status */}
            <div className="mt-3 flex flex-wrap gap-2">
                {showTwoMinutesWarning && (
                    <div className="flex items-center px-3 py-1 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-white mr-2"></span>
                        <span className="text-xs font-medium">⏰ ULTIMOS 2 MINUTOS!</span>
                    </div>
                )}

                {isExpired ? (
                    <div className="flex items-center px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-xs font-medium text-red-700">TEMPO ESGOTADO</span>
                    </div>
                ) : remainingSeconds <= totalSeconds * 0.2 && !showTwoMinutesWarning ? (
                    <div className="flex items-center px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-xs font-medium text-red-700">ÚLTIMOS MINUTOS</span>
                    </div>
                ) : remainingSeconds <= totalSeconds * 0.5 ? (
                    <div className="flex items-center px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                        <span className="text-xs font-medium text-yellow-700">METADE DO TEMPO</span>
                    </div>
                ) : (
                    <div className="flex items-center px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-xs font-medium text-green-700">BOM RITMO</span>
                    </div>
                )}

                <div className="flex items-center px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full">
                    <span className="text-xs font-medium text-indigo-700">
                        {Math.floor((totalSeconds - remainingSeconds) / 60)} min já usados
                    </span>
                </div>
            </div>

            {/* Aviso de 2 minutos */}
            {showTwoMinutesWarning && (
                <div className="mt-3 p-2 bg-linear-to-r from-red-100 to-orange-100 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="h-4 w-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-red-800">
                                Atenção! Restam apenas {Math.floor(remainingSeconds / 60)} minuto(s) e {remainingSeconds % 60} segundo(s)
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                Conclua a tarefa rapidamente ou considere adicionar mais tempo
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
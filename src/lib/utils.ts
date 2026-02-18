// src/lib/utils.ts
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

// NOVAS FUNÇÕES PARA O CRONÔMETRO
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return '00:00:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function getRemainingTime(startedAt: string, estimatedMinutes: number): number {
  if (!startedAt || !estimatedMinutes) return 0

  const startTime = new Date(startedAt).getTime()
  const now = Date.now()
  const elapsedSeconds = Math.floor((now - startTime) / 1000)
  const totalEstimatedSeconds = estimatedMinutes * 60

  return Math.max(0, totalEstimatedSeconds - elapsedSeconds)
}

export function getTimeColor(remainingSeconds: number, totalSeconds: number): string {
  if (remainingSeconds <= 0) return 'text-red-600'
  if (remainingSeconds <= totalSeconds * 0.2) return 'text-red-500'
  if (remainingSeconds <= totalSeconds * 0.5) return 'text-yellow-500'
  return 'text-green-600'
}
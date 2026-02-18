// src/lib/types.ts
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  timeSpent: number
  estimatedTime?: number
  startedAt?: Date
  completedAt?: Date
  userId: string
  createdAt: Date
  updatedAt: Date
}
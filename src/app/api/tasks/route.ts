// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createTaskNotification } from '@/lib/notifications'

// GET - Listar todas as tarefas do usuário
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tasks)

  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova tarefa
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { title, description, estimatedTime } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        estimatedTime,
        userId: user.id,
        status: 'PENDING'
      }
    })

    // Criar notificação
    await createTaskNotification(user.id, 'created', title, task.id)

    return NextResponse.json(task)

  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
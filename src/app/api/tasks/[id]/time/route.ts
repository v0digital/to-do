// src/app/api/tasks/[id]/time/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createTaskNotification } from '@/lib/notifications'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { action, seconds } = await request.json()

    const task = await prisma.task.findFirst({
      where: { id, userId: user.id }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    let updatedTask

    if (action === 'start') {
      updatedTask = await prisma.task.update({
        where: { id },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      })

      // Criar notificação de início com tempo estimado
      await createTaskNotification(user.id, 'started', task.title, id, {
        estimatedTime: task.estimatedTime
      })

    } else if (action === 'complete') {
      // Calcular tempo gasto
      const timeSpent = task.timeSpent || 0
      const finalTimeSpent = timeSpent + (seconds || 0)

      updatedTask = await prisma.task.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          timeSpent: finalTimeSpent
        }
      })

      // Criar notificação de conclusão com tempo total
      await createTaskNotification(user.id, 'completed', task.title, id, {
        timeSpent: finalTimeSpent
      })

    } else if (action === 'addTime') {
      updatedTask = await prisma.task.update({
        where: { id },
        data: {
          timeSpent: (task.timeSpent || 0) + seconds
        }
      })

    } else {
      return NextResponse.json(
        { error: 'Ação inválida' },
        { status: 400 }
      )
    }

    return NextResponse.json(updatedTask)

  } catch (error) {
    console.error('Task action error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
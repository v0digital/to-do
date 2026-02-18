// src/app/api/tasks/[id]/route.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createTaskNotification } from '@/lib/notifications'

interface Params {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { title, description, estimatedTime } = await request.json()

    const task = await prisma.task.findFirst({
      where: { id, userId: user.id }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        estimatedTime
      }
    })

    // Criar notificação
    await createTaskNotification(user.id, 'updated', title || task.title, id)

    return NextResponse.json(updatedTask)

  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const task = await prisma.task.findFirst({
      where: { id, userId: user.id }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    // Criar notificação ANTES de excluir
    await createTaskNotification(user.id, 'deleted', task.title, id)

    await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
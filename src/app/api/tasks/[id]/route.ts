// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createTaskNotification } from '@/lib/notifications'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    const { id } = await params
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { title, description, estimatedTime } = await request.json()

    const task = await prisma.task.update({
      where: { id, userId: user.id },
      data: {
        title: title?.trim(),
        description: description?.trim(),
        estimatedTime: estimatedTime ? Number(estimatedTime) : null
      }
    })

    await createTaskNotification(user.id, 'updated', task.title, id)
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    const { id } = await params
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const task = await prisma.task.findFirst({ where: { id, userId: user.id } })
    if (!task) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    await createTaskNotification(user.id, 'deleted', task.title, id)
    await prisma.task.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 })
  }
}
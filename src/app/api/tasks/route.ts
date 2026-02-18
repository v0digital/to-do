// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar tarefas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { title, description, estimatedTime } = await request.json()
    if (!title) return NextResponse.json({ error: 'Título obrigatório' }, { status: 400 })

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        estimatedTime: estimatedTime ? Number(estimatedTime) : null,
        userId: user.id,
        status: 'PENDING',
        timeSpent: 0
      }
    })
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao criar tarefa' }, { status: 500 })
  }
}
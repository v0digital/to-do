// src/app/api/tasks/[id]/time/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    const { id } = await params // OBRIGATÓRIO NO NEXT 16

    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { action } = await request.json()

    if (action === 'start') {
      const task = await prisma.task.update({
        where: { id, userId: user.id },
        data: {
            status: 'IN_PROGRESS',
            startedAt: new Date(),
            completedAt: null
        }
      })
      return NextResponse.json(task)
    }

    if (action === 'complete') {
      const task = await prisma.task.update({
        where: { id, userId: user.id },
        data: {
            status: 'COMPLETED',
            completedAt: new Date()
        }
      })
      return NextResponse.json(task)
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
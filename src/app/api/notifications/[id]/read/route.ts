// src/app/api/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

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

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      )
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Mark as read error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
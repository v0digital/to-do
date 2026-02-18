// src/app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
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

    await prisma.notification.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete notification error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
// src/app/api/notifications/read-all/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        read: false
      },
      data: { read: true }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Mark all as read error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
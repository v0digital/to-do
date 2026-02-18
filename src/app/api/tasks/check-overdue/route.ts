// src/app/api/tasks/check-overdue/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { checkTaskTimeNotifications } from '@/lib/notifications' // Nome correto da função

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Usar o nome correto da função
    const result = await checkTaskTimeNotifications(user.id)

    return NextResponse.json({
      success: true,
      result
    })

  } catch (error) {
    console.error('Check overdue tasks error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
// src/app/api/tasks/check-time/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { checkTaskTimeNotifications } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const result = await checkTaskTimeNotifications(user.id)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json({ error: 'Erro na verificação' }, { status: 500 })
  }
}
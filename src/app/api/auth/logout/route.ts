// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (user) {
      // Criar notificação de logout
      await createNotification(user.id, {
        type: 'info',
        title: 'Logout realizado',
        message: `Sessão encerrada em ${new Date().toLocaleString('pt-BR')}`
      })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('auth-token')

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
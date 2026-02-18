// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createToken } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=Token inválido`)
    }

    const user = await prisma.user.findFirst({
      where: { emailToken: token }
    })

    if (!user) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=Token inválido ou expirado`)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailToken: null
      }
    })

    // Criar notificação de verificação de email
    await createNotification(user.id, {
      type: 'success',
      title: 'Email verificado',
      message: 'Seu email foi verificado com sucesso!'
    })

    const authToken = createToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined
    })

    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)

    response.cookies.set({
      name: 'auth-token',
      value: authToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=Erro ao verificar email`)
  }
}
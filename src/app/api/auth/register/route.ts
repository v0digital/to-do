// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/utils'
import { resend } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const emailToken = Math.random().toString(36).substring(2)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailToken
      }
    })

    // NÃO criar token de sessão aqui - só após verificação do email
    // const token = createToken({ id: user.id, email: user.email, name: user.name || undefined })
    // setAuthToken(token)

    await resend.emails.send({
      from: 'TaskFlow Pro <noreply@v0-gt.com>',
      to: email,
      subject: 'Verifique seu email - TaskFlow Pro',
      html: `
        <h1>Bem-vindo ao TaskFlow Pro!</h1>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${emailToken}">
          Verificar Email
        </a>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Conta criada! Verifique seu email para ativar sua conta.'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
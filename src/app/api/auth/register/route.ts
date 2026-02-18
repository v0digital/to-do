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
        { error: 'Este e-mail já está em uso' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const emailToken = Math.random().toString(36).substring(2)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailToken
      }
    })

    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${emailToken}`

    await resend.emails.send({
      from: 'v0 Digital <noreply@v0digital.com.br>',
      to: email,
      subject: 'Verifique sua conta - v0 Digital',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .logo { font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 30px; text-align: center; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
              .content { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; text-align: center; }
              h1 { color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 16px; }
              p { color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 30px; }
              .button { background-color: #111827; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; }
              .footer { margin-top: 30px; text-align: center; color: #9ca3af; font-size: 14px; }
              .divider { height: 1px; background-color: #f3f4f6; margin: 30px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">v0 Digital</div>
              <div class="content">
                <h1>Verifique seu e-mail</h1>
                <p>Olá, ${name || 'usuário'}.<br>Obrigado por se juntar à nossa plataforma. Para começar a gerenciar suas tarefas, precisamos apenas confirmar seu endereço de e-mail.</p>
                <a href="${verificationUrl}" class="button">Ativar minha conta</a>
                <div class="divider"></div>
                <p style="font-size: 13px; color: #9ca3af; margin-bottom: 0;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
                <p style="font-size: 12px; color: #6b7280; word-break: break-all;">${verificationUrl}</p>
              </div>
              <div class="footer">
                &copy; 2026 v0 Digital. Todos os direitos reservados.
              </div>
            </div>
          </body>
        </html>
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
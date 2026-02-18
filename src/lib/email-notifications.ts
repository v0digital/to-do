// src/lib/email-notifications.ts
import { resend } from './resend'
import { prisma } from './prisma'

export async function sendNotificationEmail(userId: string, notification: any) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    })

    if (!user) return null

    await resend.emails.send({
      from: 'TaskFlow Notificações <notificacoes@v0-gt.com>',
      to: user.email,
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">${notification.title}</h2>
          <p>${notification.message}</p>
          <p style="color: #666; font-size: 14px;">
            ${new Date().toLocaleString('pt-BR')}
          </p>
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard/notifications"
               style="color: #4f46e5; text-decoration: none;">
              Ver todas as notificações →
            </a>
          </p>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending notification email:', error)
    return false
  }
}
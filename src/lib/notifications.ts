// src/lib/notifications.ts
import { prisma } from './prisma'

async function sendNotificationEmail(userId: string, notification: { title: string; message: string }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    })

    if (!user || !process.env.RESEND_API_KEY) return null

    const { resend } = await import('./resend')

    await resend.emails.send({
      from: 'TaskFlow Notificações <notificacoes@taskflow.com>',
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
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard"
               style="color: #4f46e5; text-decoration: none;">
              Acessar Dashboard →
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

export async function createNotification(userId: string, {
  type,
  title,
  message,
  taskId,
  sendEmail = true
}: {
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  taskId?: string
  sendEmail?: boolean
}) {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        title,
        message,
        createdAt: {
          gte: oneHourAgo
        }
      }
    })

    if (existingNotification) {
      return existingNotification
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        taskId,
        read: false
      }
    })

    if (sendEmail) {
      sendNotificationEmail(userId, { title, message }).catch(console.error)
    }

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

export async function createTaskNotification(userId: string, action: string, taskTitle: string, taskId?: string, extraData?: any) {
  const notifications = {
    created: {
      type: 'success' as const,
      title: 'Tarefa criada',
      message: `Tarefa "${taskTitle}" foi criada com sucesso.`
    },
    updated: {
      type: 'info' as const,
      title: 'Tarefa atualizada',
      message: `Tarefa "${taskTitle}" foi atualizada.`
    },
    deleted: {
      type: 'warning' as const,
      title: 'Tarefa excluída',
      message: `Tarefa "${taskTitle}" foi excluída.`
    },
    started: {
      type: 'info' as const,
      title: 'Tarefa iniciada',
      message: `Tarefa "${taskTitle}" foi iniciada.${extraData?.estimatedTime ? ` Tempo estimado: ${extraData.estimatedTime} minutos.` : ''}`
    },
    completed: {
      type: 'success' as const,
      title: 'Tarefa concluída',
      message: `Tarefa "${taskTitle}" foi concluída com sucesso!${extraData?.timeSpent ? ` Tempo total: ${Math.floor(extraData.timeSpent / 60)} minutos.` : ''}`
    },
    almost_expired: {
      type: 'warning' as const,
      title: 'Tarefa prestes a expirar',
      message: `Tarefa "${taskTitle}" está prestes a expirar! Restam ${extraData?.remainingMinutes || 30} minutos.`
    },
    time_expired: {
      type: 'error' as const,
      title: 'Tempo da tarefa expirado',
      message: `Tarefa "${taskTitle}" excedeu o tempo estimado!${extraData?.exceededMinutes ? ` Excedeu por ${extraData.exceededMinutes} minutos.` : ''}`
    },
    half_time: {
      type: 'info' as const,
      title: 'Metade do tempo da tarefa',
      message: `Tarefa "${taskTitle}" já consumiu metade do tempo estimado.`
    },
    overdue: {
      type: 'warning' as const,
      title: 'Tarefa atrasada',
      message: `Tarefa "${taskTitle}" está em andamento há mais de 24 horas.`
    },
    forgotten: {
      type: 'info' as const,
      title: 'Tarefa esquecida',
      message: `Tarefa "${taskTitle}" está pendente há mais de 3 dias.`
    }
  }

  const notification = notifications[action as keyof typeof notifications]
  if (!notification) return null

  return await createNotification(userId, {
    ...notification,
    taskId
  })
}

export async function createSystemNotification(userId: string, {
  type,
  title,
  message
}: {
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
}) {
  return await createNotification(userId, {
    type,
    title,
    message
  })
}

export async function checkTaskTimeNotifications(userId: string) {
  try {
    const now = new Date()
    const notificationsCreated = {
      almost_expired: 0,
      time_expired: 0,
      half_time: 0
    }

    const tasksInProgress = await prisma.task.findMany({
      where: {
        userId,
        status: 'IN_PROGRESS',
        startedAt: { not: null },
        estimatedTime: { not: null, gt: 0 }
      }
    })

    for (const task of tasksInProgress) {
      if (!task.startedAt || !task.estimatedTime) continue

      const startedAt = new Date(task.startedAt)
      const elapsedMinutes = Math.floor((now.getTime() - startedAt.getTime()) / (1000 * 60))
      const remainingMinutes = task.estimatedTime - elapsedMinutes

      if (remainingMinutes <= 30 && remainingMinutes > 0) {
        await createTaskNotification(userId, 'almost_expired', task.title, task.id, {
          remainingMinutes
        })
        notificationsCreated.almost_expired++
      }

      if (elapsedMinutes > task.estimatedTime) {
        const exceededMinutes = elapsedMinutes - task.estimatedTime

        if (exceededMinutes % 30 === 0) {
          await createTaskNotification(userId, 'time_expired', task.title, task.id, {
            exceededMinutes
          })
          notificationsCreated.time_expired++
        }
      }

      if (elapsedMinutes >= Math.floor(task.estimatedTime / 2) && elapsedMinutes < Math.floor(task.estimatedTime / 2) + 1) {
        await createTaskNotification(userId, 'half_time', task.title, task.id)
        notificationsCreated.half_time++
      }
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const overdueTasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'IN_PROGRESS',
        startedAt: {
          lt: twentyFourHoursAgo
        }
      }
    })

    for (const task of overdueTasks) {
      await createTaskNotification(userId, 'overdue', task.title, task.id)
    }

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const forgottenTasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        createdAt: {
          lt: threeDaysAgo
        }
      }
    })

    for (const task of forgottenTasks) {
      await createTaskNotification(userId, 'forgotten', task.title, task.id)
    }

    return notificationsCreated
  } catch (error) {
    console.error('Error checking task time notifications:', error)
    return null
  }
}

export async function checkOverdueTasks(userId: string) {
  return checkTaskTimeNotifications(userId)
}
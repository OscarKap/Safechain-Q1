import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface NotificationData {
  recipient_id: string;
  message: string;
  type?: string;
}

export const createNotification = async (data: NotificationData) => {
  return await prisma.notification.create({
    data: {
      recipient_id: data.recipient_id,
      message: data.message,
      type: data.type || 'in_app',
    },
  });
};

export const createNotificationsForRoles = async (
  message: string,
  type?: string,
  roles?: string[]
) => {
  if (!roles || roles.length === 0) {
    return [];
  }

  const recipients = await prisma.user.findMany({
    where: {
      role: {
        name: {
          in: roles,
        },
      },
      is_active: true,
    },
    select: {
      id: true,
    },
  });

  const notifications = await Promise.all(
    recipients.map((recipient) =>
      createNotification({
        recipient_id: recipient.id,
        message,
        type,
      })
    )
  );

  return notifications;
};

export const getMyNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: {
      recipient_id: userId,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const markAsRead = async (notificationId: string, userId: string) => {
  return await prisma.notification.update({
    where: {
      id: notificationId,
      recipient_id: userId,
    },
    data: {
      read: true,
    },
  });
};
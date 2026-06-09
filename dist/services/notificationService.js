"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getMyNotifications = exports.createNotificationsForRoles = exports.createNotification = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNotification = async (data) => {
    return await prisma.notification.create({
        data: {
            recipient_id: data.recipient_id,
            message: data.message,
            type: data.type || 'in_app',
        },
    });
};
exports.createNotification = createNotification;
const createNotificationsForRoles = async (message, type, roles) => {
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
    const notifications = await Promise.all(recipients.map((recipient) => (0, exports.createNotification)({
        recipient_id: recipient.id,
        message,
        type,
    })));
    return notifications;
};
exports.createNotificationsForRoles = createNotificationsForRoles;
const getMyNotifications = async (userId) => {
    return await prisma.notification.findMany({
        where: {
            recipient_id: userId,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
};
exports.getMyNotifications = getMyNotifications;
const markAsRead = async (notificationId, userId) => {
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
exports.markAsRead = markAsRead;
//# sourceMappingURL=notificationService.js.map
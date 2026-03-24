import { Notification } from '../models/Notification';

export class NotificationService {
  async create(params: {
    userId: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }) {
    return Notification.create({
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      data: params.data ?? undefined,
    });
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId }),
    ]);

    // Format IDs
    const formattedNotifications = notifications.map((n: any) => ({
      ...n,
      id: n._id.toString(),
      _id: undefined
    }));

    return {
      data: formattedNotifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: string) {
    return Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  }

  async getUnreadCount(userId: string) {
    return Notification.countDocuments({ userId, isRead: false });
  }
}

export const notificationService = new NotificationService();

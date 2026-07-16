import { db } from "../data/mockDb";

export async function getNotifications(userId, role) {
  const allNotifications = await db.list("notifications");
  
  return allNotifications.filter(notification => {
    // If targeted specifically at a user
    if (notification.targetUserId && notification.targetUserId === userId) {
      return true;
    }
    // If targeted at a role (like STAFF or DOCTOR)
    if (notification.targetRoles && notification.targetRoles.includes(role)) {
      return true;
    }
    return false;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createNotification(data) {
  // data should contain: targetUserId OR targetRoles, title, message, path (optional), tone (optional)
  const notification = {
    ...data,
    read: false,
    createdAt: new Date().toISOString()
  };
  return db.create("notifications", notification, "notif");
}

export async function markAsRead(id) {
  return db.update("notifications", id, { read: true });
}

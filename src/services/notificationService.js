import api from "./api";

export async function getNotifications(userId, role) {
  return api.get("/notifications", { params: { recipientId: userId, recipientRole: role } }).then((res) => res.data);
}

export async function createNotification(data) {
  const recipientRole = data.recipientRole || (data.targetRoles && data.targetRoles[0]) || null;
  const recipientId = data.recipientId || data.targetUserId || null;
  
  const payload = {
    recipientRole,
    recipientId,
    title: data.title,
    message: data.message,
    isRead: false
  };
  return api.post("/notifications", payload).then((res) => res.data);
}

export async function markAsRead(id) {
  return api.put(`/notifications/${id}`).then((res) => res.data);
}

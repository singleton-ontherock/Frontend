import api from "./index";

export const getNotification = () => {
  return api.get('/sender/notification');
};

export const postNotification = (recipientIds, message) => {
  return api.post('/sender/notification', {
    recipientIds,
    message
  });
}

export const deleteNotification = (notificationId) => {
  return api.delete(`/sender/notification/${notificationId}`);
};

export default {
  getNotification,
  postNotification,
  deleteNotification,
}
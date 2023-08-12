import { Notifications, NotificationType } from "@twilio/flex-ui";

Notifications.registerNotification({
  id: "updateQASuccessNotification",
  closeButton: true,
  content: "Knowledgebase updated successfully.",
  timeout: 2000,
  type: NotificationType.success,
});

Notifications.registerNotification({
  id: "updateQAErrorNotification",
  closeButton: true,
  content: "Error updating knowledgebase with question and answer.",
  timeout: 2000,
  type: NotificationType.error,
});

const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotificationsByStudent,
  createNotificationForMentor,
  clearNotifications,
} = require('../controllers/notificationControllers');

// Create a notification
router.post('/create-notification', createNotification);
router.post('/create-notification-mentor', createNotificationForMentor);

// Get notifications for a student
router.get('/get-notification', getNotificationsByStudent);

// Delete a notification
router.delete("/clear-notifications",clearNotifications);

module.exports = router;

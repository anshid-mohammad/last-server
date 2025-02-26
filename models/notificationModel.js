const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who will receive the notification
    required: false
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course', // Reference to the user who will receive the notification
    required: false
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher', // Reference to the user who will receive the notification
    required: false
  },
  message: {
    type: String,
    required: true
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);

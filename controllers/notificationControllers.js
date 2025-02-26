const Notification = require('../models/notificationModel');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { studentId, courseId, teacherId, message } = req.body;

 

    const notification = new Notification({
        studentId,
      courseId,
      teacherId,
      message,
    });

    await notification.save();

    res.status(201).json({ message: "Notification created successfully", notification });
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
};
const createNotificationForMentor = async (req, res) => {
    try {
      const { studentId, message } = req.body;
  
   
  
      const notification = new Notification({
          studentId,
        message,
      });
  
      await notification.save();
  
      res.status(201).json({ message: "Notification created successfully", notification });
    } catch (error) {
      res.status(500).json({ message: "Error creating notification", error: error.message });
    }
  };

const  getNotificationsByStudent = async (req, res) => {
    try {
        const { studentId, teacherId } = req.query; // Use req.query for GET requests

        if (!studentId && !teacherId) {
            return res.status(400).json({ message: "Invalid request. User ID is required." });
        }

        console.log("Fetching notifications for:", { studentId, teacherId });

        // Dynamically build the filter condition
        const filter = {};
        if (studentId) filter.studentId = studentId;
        if (teacherId) filter.teacherId = teacherId;

        const notifications = await Notification.find(filter);

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching notifications",
            error: error.message,
        });
    }
};
  
  
// Delete a notification
const clearNotifications = async (req, res) => {
    try {
      const { studentId, teacherId } = req.body;
  
     
  
      await Notification.deleteMany({
        $or: [
          studentId ? { studentId } : {},
          teacherId ? { teacherId } : {},
        ],
      });
  
      res.status(200).json({ success: true, message: "Notifications cleared successfully" });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      res.status(500).json({ success: false, message: "Error clearing notifications", error: error.message });
    }
  };
  

module.exports = {
  createNotification,
  getNotificationsByStudent,
  clearNotifications,
  createNotificationForMentor
};

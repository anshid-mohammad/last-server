
const CourseDetails=require("../models/teachersForm")
const Course = require('../models/teachersForm'); // Import your Mongoose Course model
// AWS Configuration
const { s3, upload, randomFileName, sharp } = require('../utils/s3Clinet');
 const AWS_REGION="eu-north-1"
 const AWS_S3_BUCKET_NAME="skillhub-learningapp"

const addCourseDetails = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No photo file provided' });
  }

  const fileFormat = file.mimetype.includes("png") ? "png" : "jpeg";

    try {
      // Process image using Sharp
      const buffer = await sharp(file.buffer)
      .resize({ width: 720, fit: "contain" }) // Resize width to 720px, auto height
      .webp({ quality: 50 }) // Convert to WebP with 50% quality
      .toBuffer();

    const uniqueFileName = `${Date.now()}_${randomFileName()}_${file.originalname}`;
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();
    const imageUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    const lessons = req.body.lessons ? JSON.parse(req.body.lessons) : [];

    const teacherId =req.body.teacherId
    // Save course data including image URL
    const newCourse = new Course({
      ...req.body,
      photo: imageUrl,
      lessons,
      teacherId,
    });

    await newCourse.save();

    res.status(201).json({ message: 'Course created successfully!', course: newCourse });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Failed to add course', error: error.message });
  }
};




const getCourseData = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};

// Controller to get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      message: 'Error fetching course',
      error: error.message,
    });
  }
};

// Controller to update a course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.photo = req.file.filename; // Update the photo if provided
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      message: 'Error updating course',
      error: error.message,
    });
  }
};

// Controller to delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      message: 'Error deleting course',
      error: error.message,
    });
  }
};
const updatePriceAndEnroll = async (req, res) => {
  try {
    const { courseId, price } = req.body; // Ensure price is received

    if (!courseId || price === undefined) {
      return res.status(400).json({ message: 'Course ID and price are required' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { price }, // Corrected update syntax
      { new: true } // Move new: true to the correct argument
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message,
    });
  }
};


// Enroll a user in a course
const enrollCourse = async (req, res) => {
  const { courseId, userId } = req.body;

  try {
    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if the user is already enrolled
    if (course.studentId === userId) {
      return res.status(400).json({ success: false, message: 'User already enrolled' });
    }

    // Update the course with the student's ID
    course.studentId = userId;
    await course.save();

    res.status(200).json({ success: true, message: 'Enrollment successful', course });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ success: false, message: 'Failed to enroll in course', error: error.message });
  }
};



module.exports = {
  addCourseDetails,
  getCourseData,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  updatePriceAndEnroll
};
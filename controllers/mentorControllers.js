const Mentor = require("../models/mentor");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwtUtils");
const CourseDetails= require("../models/teachersForm")
const { s3, upload, randomFileName, sharp } = require('../utils/s3Clinet');
const Student = require("../models/studentForm")
 const AWS_REGION="eu-north-1"
 const AWS_S3_BUCKET_NAME="skillhub-learningapp"

const mentorSignup = async (req, res) => {
  try {
    const { name, email,phoneNumber, password } = req.body;

    if (!name || !email  || !phoneNumber|| !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const MentorExisting = await Mentor.findOne({ email });
    if (MentorExisting) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMentor = new Mentor({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    await newMentor.save();
    res.status(201).json({
      message: "User registered successfully",
      MentorId: newMentor._id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const mentorLogin = async (req, res) => {
  try {
    const { email, password,phoneNumber } = req.body;

    const mentor = await Mentor.findOne({ email }).select("+password");
    if (!mentor) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(mentor);

    res.status(200).json({ message: "Login successful", userId:mentor._id ,username:mentor.name,userRole:mentor.role,token});

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const getAllVendor = async (req, res) => {
    try {
      const user = await Mentor.find();
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Failed to fetch students' });
    }
  };

  const addVentorImage = async (req, res) => {
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
  
      // Generate unique file name
      const uniqueFileName = `${Date.now()}_${file.originalname}`;
  
      // S3 upload parameters
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: file.mimetype,
      };
  
      // Upload to S3
      const data = await s3.upload(params, { PartSize: 10 * 1024 * 1024, QueueSize: 1 }).promise();
      const imageUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uniqueFileName}`;
  
      // Find user and update the photo field
      const updatedUser = await Mentor.findByIdAndUpdate(
        req.body.userId, // Make sure this ID is being sent in the request
        { $set: { photo: imageUrl } }, // Set the new photo URL
        { new: true } // Return updated user document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User image updated successfully!', user: updatedUser });
    } catch (error) {
      console.error('Error updating user image:', error);
      res.status(500).json({ message: 'Failed to update user image', error: error.message });
    }
  };
  const updateProfileVentor = async (req, res) => {
    const { userId,email, name, address, phoneNumber,bio,nation,gender,dob,workExperience,  certifications ,skills,hobbies } = req.body;
  
    if (!userId || !name || !address || !phoneNumber || !bio) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const updatedUser = await Mentor.findByIdAndUpdate(
        userId,
        { name, address,email, phoneNumber ,bio,nation,dob,gender,workExperience,  certifications ,skills,hobbies},
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
  };
  
  
  const addStudentIdInMentorStore = async (req, res) => {
    try {
      const { studentId, teacherId } = req.body;
      console.log("Adding Student to Mentor:", teacherId, studentId);
  
      // Find mentor by ID
      const mentor = await Mentor.findById(teacherId);
      if (!mentor) {
        return res.status(404).json({ success: false, message: 'Mentor not found' });
      }
  
      // Ensure `studentId` is stored as an array, add only if it's not already present
      if (!mentor.studentIds.includes(studentId)) {
        mentor.studentIds.push(studentId);
        await mentor.save();
      } else {
        return res.json({ success: false, message: 'Student already assigned to this mentor' });
      }
  
      res.json({ success: true, message: 'Student assigned to mentor successfully' });
    } catch (error) {
      console.error('Error assigning student to mentor:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  const getTeacherId = async (req, res) => {
    try {
      const { id } = req.params; 
      const teacher = await Mentor.findById(id);
  
      if (!teacher) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      res.status(200).json(teacher);
    } catch (error) {
      console.error("Error fetching course:", error.message);
  
      res.status(500).json({
        message: "Error fetching course",
        error: error.message,
      });
    }
  };
  const changeStatusReview = async (req, res) => {
    try {
      const { id } = req.params; // Get the student ID from the route parameter
      const { status } = req.body; // Get the new status from the request body
  
      // Find and update the student by its ID
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { status },
        { new: true } // Return the updated document
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
  
      res.status(200).json({
        success: true, 
        message: "Status updated successfully",
        student: updatedStudent, 
      });
    } catch (error) {
      console.error("Error updating status:", error);
  
      res.status(500).json({
        success: false, // ✅ Ensure consistency in error responses
        message: "Failed to update status",
        error: error.message,
      });
    }
  };

module.exports = {mentorLogin, mentorSignup,getAllVendor,addVentorImage,updateProfileVentor,addStudentIdInMentorStore,getTeacherId,changeStatusReview};

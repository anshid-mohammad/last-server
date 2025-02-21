const express = require("express");
const router = express.Router();
const {addCourseDetails,getCourseData, addStudentIdbtCourse, enrollCourse, updatePriceAndEnroll,} =require("../controllers/teachersContollers")

const multer = require('multer');
const { getTeacherId } = require("../controllers/mentorControllers");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/add-course', upload.single('photo'), addCourseDetails);
router.get("/get-course",getCourseData)
router.post("/image")
router.post("/enroll-course",enrollCourse)
router.post("/update-price",updatePriceAndEnroll)
router.get("/get-mentorbyid/:id",getTeacherId)


module.exports=router
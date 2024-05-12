const express = require("express");
const router = express.Router();

// Import Course Controller
const {createCourse, getAllCourses, getCourseDetails, getFullCourseDetails, editCourse, getInstructorCourses, deleteCourse} = require("../controllers/Course");

const {createCategory, categoryPageDetails, showAllCategories} = require("../controllers/Category");

const {createSection, deleteSection, updateSection} = require("../controllers/Section");

const {createSubSection, deleteSubSection, updateSubSection} = require("../controllers/Subsection");

const {getAllRating, getAverageRating, createRating} = require("../controllers/RatingAndReview");

const {auth, isAdmin, isInstructor, isStudent} = require("../middlewares/auth");


//--------------------------------------------------------------------Course Route----------------------------------------

// Course can only be created bu Instructor
router.post("/createCourse", auth, isInstructor, createCourse)

// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)

// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)

// Delete a section
router.post("/deleteSection", auth, isInstructor, deleteSection)

// update SubSection
router.post("/updateSubSection", auth, isInstructor, updateSubSection)

// delete sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

// Add a Sub section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)

// Get all Registered Course
router.get("/getAllCourses", getAllCourses)

// Get details for a specified Course
router.post("/getCourseDetails", getCourseDetails)

// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)



// ------------------------------------------Category Routes (Only By admin)------------------------------------------------

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
// router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/getCategoryPageDetails", categoryPageDetails)

//--------------------------------------------------- Rating and Reviews----------------------------------------------------

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router;


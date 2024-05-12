const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
//--------------------------------------------------------- Create Course--------------------------------------------------------

exports.createCourse = async(req, res) => {
    try {
        // Get user Id from the request Object
        const userId = req.user.id;
        console.log("Create Course mai aaya kya??")
        console.log("UserD=Id", userId);

        // Get all required fields from the request body
        const {
            courseName, 
            courseDescription, 
            whatYouWillLearn, 
            price, 
            tag,
            category,
            status,
            instructions,
        } = req.body;

        console.log("Aaya kya->Controller/course.js??")

        // Get Thumbnail image from request files
        const thumbnail = req.files.thumbnailImage;
        console.log("Thumbnail", thumbnail);

        // const tag = JSON.parse(_tag)
        // const instructions = JSON.parse(_instructions)

        // console.log("tag", tag)
        // console.log("instructions", instructions)
        
        // Validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !thumbnail || !category){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        console.log("Aaya kya ->Controller/course.js??")

        if(!status || status === undefined){
            status = "Draft";
        }


        // Check for Instructor ---Kyuki Instructor hi Course Create kr sakta hai
        // Agar Instructor nahi hai toh Response Return krdo
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });
        console.log("Instructor Details",instructorDetails);    

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found",
            });
        }
        console.log("Isme bhi aaya")

        // Check Given category is Valid or not
        // Admin se Banaya hua category mai se hi select kr sakta hai Instructor 
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "Category Details not Found",
            });
        }
        console.log("first")

        // Upload the Thumbnail to Cloundinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log(thumbnail);
        console.log("Isme nahi aaya kya")

        // Create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions: instructions,
        });

        // Add the new Course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id}, 
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new: true},
        );

        // Update Category Schema  --> HW
        const categoryDetails2 = await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            {new: true}
        );
        console.log("HEREEEEEEEE", categoryDetails2)
        // return response
        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        });

    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to create Course",
            error: "Create Course-->"+error.message
        })
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

//-------------------------------------------------------------- Get All Courses-------------------------------------------------------

exports.getAllCourses = async(req, res) => {
    try {
        const allCourses = await Course.find({status: "Published"}, {
                                                courseName: true,    
                                                price: true,
                                                thumbnail: true,
                                                instructor: true,
                                                ratingAndReviews: true,
                                                studentEnrolled: true
                                            }).populate("instructor").exec();
                                            
        return res.status(200).json({
            success: true,
            message: "Data for all Courses Fetched Successfully",
            data: allCourses,
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Cannot Fetch course Data",
            error: error.message
        })
    }
}

//---------------------------------------------------------- Get Course Details--------------------------------------------------------------

exports.getCourseDetails = async(req, res) => {
    try {
        //Fetch Course ki Id from Req body
        const {courseId} = req.body;
        
        // Find Course Details
        const courseDetails = await Course.findOne(
                                    {_id: courseId})
                                    .populate(
                                        {
                                            path:"instructor",//course model mai instructor hai 
                                            // instructor ke profile ka details jo tha usse bhi populate krra
                                            populate: {
                                                path: "additionalDetails" 
                                            }

                                        }
                                    )
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    // Populate ke andar Populate kiya ja raha hai isliye
                                    .populate(
                                        {
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                                select: "-videoUrl",
                                            }
                                        }
                                    )
                                    .exec();
        
        // Validation
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find the course with this ${courseId}`,
            });
        }


        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        // Return response
        return res.status(200).json({
            success: true,
            message: "Course Details Fetched Successfully",
            data: {
              courseDetails,
              totalDuration
            }
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: error.message
        });
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
}

exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }

























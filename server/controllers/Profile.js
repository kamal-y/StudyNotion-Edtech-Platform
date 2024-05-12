const Course = require('../models/Course');
const Profile = require('../models/Profile');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
// const {uplodeImageToCloudinary} = require("../utils/imageUploader");



// --------------------------------------------------------Update Profile------------------------------------------------------

// Why Update Profile, Not Create Profile??
// Humne Auth.js mai Profile already Create Kiya hua hai or NULL value Assign hai udhar
// Agar Auth.js mai Profile Create nahi hota toh hum ko Profile.js mai Profile Create krna hota or Auth.js mai ID push kr dete 

exports.updateProfile = async(req, res) => {
    try {
        // 1.Get data from req body
        const {dateOfBirth="", about="", contactNumber} = req.body;

        // 2.Get UserId
        // Payload mai email, user_id, accountType hai toh udhar se Fetch kiya hai UserId.
        // Auth.js --> login --> payload --> req.user = decode --> Middleware --> autj.js
        // req.user = decode

        const id = req.user.id;

        // 3.Validate
        // if(!contactNumber || !gender || !id){
        //     return res.status(400).json({
        //         success: true,
        //         message: "All Fields are Required",
        //     });
        // }

        // 4.Find profile  ----> userDetails Nikal then usme ProfileId hai(additionalDetails) naam hai
        const userDetails = await User.findById(id);

        // Idhar profile Details mil gaya pura ka pura
        const profile = await Profile.findById(userDetails.additionalDetails);


        // 5.Update Profile
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        
        // Save function isliye use hua hai ki Object Already Create hua pada hai Auth.js -> login mai
        // idhar bas save krna hai
        await profile.save();

        // 6.Return Response 
        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            profile,
        });
  } 
  catch (error) {
      return res.status(500).json({
          success: false,
          error: error.message
      });
  }
}


//----------------------------------------------------- Delete Account-------------------------------------------------------

exports.deleteAccount = async(req, res) => {
    try {
        //1.Fetch user id
        const id = req.user.id;
        
        //2.Validation
        const user = await User.findById({_id:id});
        if(!user){
            return res.status(404).json({
                success: true,
                message: "User not Found"
            });
        }

        // 3.Delete Profile
        await Profile.findByIdAndDelete({_id:user.additionalDetails});

        //4.Delete User
        await User.findByIdAndDelete({_id:id});

        // TODO: Unenroll users from all Enrolled Courses

        //5.Return Response
        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
        })

    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be Deleted Successfully",
        })
    }
}


//----------------------------------------------------- Get all user Data-----------------------------------------------

exports.getAllUserDetails = async(req, res) => {
    try {
        // get User id
        const id = req.user.id;

        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response
        return res.status(200).json({
            success: true,
            message: "User Data Fetched Successfully",
            data: userDetails,
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//--------------------------------------------------Update Display Picture-------------------------------------------------

exports.updateDisplayPicture = async (req, res) => {
    try {
      // const displayPicture  = req.files.displayPicture;

      const displayPicture = req.files.displayPicture;
      console.log("displayPicture",displayPicture);

      const userId = req.user.id;
      console.log("Userid",userId);

      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      console.log("Image->",image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update Profile ka error hai->"+ error,
      })
    }
};

//------------------------------------------------- Get Enrolled Course--------------------------------------------------------


exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
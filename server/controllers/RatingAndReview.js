const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//---------------------------------------------------CreateRating----------------------------------------------------------------------

exports.createRating = async(req, res) => {
    try {
        //  Get userId from payload
        const userId = req.user.id; 

        // Fetch Course, Rating and Review from req body
        const {courseId, rating, review} = req.body;

        // Check if user is Enrolled or not 
        const courseDetails = await Course.findOne(
                                        {
                                            _id: courseId,
                                            studentsEnrolled: {$elemMatch: {$eq: userId}},   
                                        });
                                    
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not Enrolled in this course",
            }); 
        }

        // Check if user is already reviewed the coures
        const alreadyReviewed = await RatingAndReview.findOne({
                                                        user: userId,
                                                        course: courseId,
                                                    });
        // if already reviewed
        if(!alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "Course is already Reviewed by the user"
            })
        }

        // Create Rating and Review in Db
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        });

        // Update Course Model with this Rating and Review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id: courseId},
                                {
                                    $push: {
                                        // ratingAndReview update kiya ---- ratingReview ke help se
                                        ratingAndReviews: ratingReview._id,
                                    },
                                },
                                {new: true}
        )
        console.log(updatedCourseDetails);

        // return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review",
            ratingReview
        });    
    } 
    catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message
      })  
    }
}


//---------------------------------------------------getAverageRating----------------------------------------------------------------------
// Aggregation concept :Group values from multiple documents together. Perform operations on the grouped data to return a single result
// Apply Multiple operators in order wise
// group Multiple queries 

exports.getAverageRating = async(req, res) => {
    try {
        // get courseId
        const courseId = req.body.courseId;

        // Claculate Average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId), //string ko Object mai convert kiya hai
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "rating" } //"rating" RatingandReview Model ka Attribute hai uspe average ho raha hai
                }
            }
        ]);

        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // if no rating and review exist
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no ratings given till now",
            averageRating: 0

        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message 
        })
    }
}




//---------------------------------------------------getAllRating----------------------------------------------------------------------
exports.getAllRating = async(req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
                                            .sort({rating: "desc"}) //rating desc kyu--> 5star rating upar rehna chahiye website pe isliye
                                            .populate({
                                                path: "user",
                                                select: "firstname lastname email image", //user mai se selected fields ko populate krwaya hai
                                            })
                                            .populate({
                                                path: "course",
                                                select: "courseName",
                                            })
                                            .exec();

        // Return response
        return res.status(200).json({
            success: true,
            message: "All Reviews Fetched Successfully",
            data: allReviews
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

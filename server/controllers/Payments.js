const { default: mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
const { mailSender } = require("../utils/mailSender");
require("dotenv").config();

// initiate the razorpay order
exports.capturePayment = async(req, res) => {

    // const {courses} = req.body;
    console.log("Server/Payment/")
    const {courses} = req.body;
    console.log("Server/Payment/",courses);
    const userId = req.user.id;

    if(courses.length === 0){
        return res.json({
            success: false,
            message: "Please provide Courses id"
        })
    }
    console.log("Server/Payment/1")
    let totalAmount = 0;
    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(200).json({success:false, message:"Could not find the Course"});
            }
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({success:false, message: "Student is already Enrolled"});
            }
            totalAmount += course.price;
            console.log("Server/Payment/2")
        }
        catch(error){
            console.log(error);
            return res.status(500).json({success: false, message: error.message})
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            message: paymentResponse,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate Order"
        })
    }
    
}

// Payment Verification
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    console.log("Order_Id",req.body?.razorpay_order_id);
    console.log("Payment_id",req.body?.razorpay_payment_id);
    console.log("Signature",req.body?.razorpay_signature);
    console.log("Courses",req.body?.courses);
    console.log("userId",req.user.id);

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(200).json({success: false, message: "Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256",  process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    console.log("Server/controllers/Payment-1",expectedSignature);
    console.log("Server/controllers/Payment-1",razorpay_signature);
    if(expectedSignature === razorpay_signature){
        // enroll students
        await enrollStudents(courses, userId, res);

        // return response
        return res.status(200).json({
            success: true,
            message: "Payment Verified"
        })
    }
    console.log("Server/controllers/Payment-2")
    return res.status(200).json({success: false, message: "Payment Failed"})
    
}

const enrollStudents = async(courses, userId, res) => {
    if(!courses || !userId){
        return res.status(400).json({
            success: false,
            message: "Please Provide Data for Courses or UserId"
        })
    }

    for(const courseId of courses){
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled: userId}},
                {new:true},
            )
    
            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course not Found"
                })
            }
    
            // find the student and add the course to their list of enrolledCourses
            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {$push:{
                    courses: courseId,
    
                }},{new: true});
    
            // Send mail
            const emailResponse = await mailSender(
                enrollStudents.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            )
            // console.log("Email sent Successfully", emailResponse.response);
        } catch (error) {
            console.log(error);
            return res.status(500).json({success: false, message: error.message})
        }
    }
}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success: false,
            message: "Please provide all the Fields"
        });
    }

    try {
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
            amount/100,orderId, paymentId)
        )
    } catch (error) {
        console.log("Error in sending mail", error)
        return res.status(500).json({success: false, message: "Could not send mail"})
    }
}



//---------------------------- capture the payment and initiate the Razorpay order---------------------------------------

// exports.capturePayment = async(req, res) => {
    
//     // 1. --------------------get courseId and userId
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     // ----------------------------2.validate CourseId
//     if(!course_id){
//         return res.json({
//             success: false,
//             message: "Please Provide valid Course Id",
//         });
//     };


//     // ------------------3.validate CourseDetail
//     let course;
//     try {
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success: false,
//                 message: "Could not found the course"
//             });
//         } 
        
        
//         // --------------4.check user already pay for the same course
//         // Convert the String Userid to Object Userid
//         const uid = new mongoose.Types.ObjectId(userId); 
//         // Student pehle se hi Enrolled nahi hai woohi course mai, Check krna hai
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success: false,
//                 message: "Student is Already Enrolled"
//             })
//         }
//     } 
//     catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
    
//     //----------------------------- 5.create order
//     const amount = course.price;
//     const currency = "INR";
//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes: {
//             courseId: course_id,
//             userId, 
//         }
//     };
//     try {
//         //------------------------initiate the payment using razorpay

//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse); 

//         //----------------------------------- Return response
//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             description: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         })
//     } 
//     catch (error) {
//         console.log(error);
//         return res.json({
//             success: false,
//             message: "Could not initiate order",
//         });
//     };
// }


//--------------------------------------- Verify Signature(Some Secret Number) of Razorpay and Server---------------------------------------

// exports.verifySignature = async(req, res) => {

//     // Yeh webhook signature Server pe pada hai
//     const webhookSecret = "123456789";

//     // Yeh signature Razorpay se aaya hai
//     const signature = req.headers["x-razorpay-signature"];

//     // Three steps to compare both signature
//     //--------------------- 1.
//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     //--------------------- 2.
//     shasum.update(JSON.stringify(req.body));
//     //--------------------- 3.
//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("Payment is Authorised");

//         // Yeh courseId and UserId Razorpay(notes parameter mai se) se fetch ho raha hai, Req body mai nahi send kr raha user
//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try {
//             //Fulfil the action
            
//             // Find the course and enroll the student in it
//             const enrolledCourse = await Course.findByIdAndUpdate(
//                                             {_id: courseId},
//                                             {$push: {studentEnrolled: userId}},
//                                             {new: true},
//             );

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success: false,
//                     message: "Course not found"
//                 });
//             }
//             console.log(enrolledCourse);

//             // Find the student and add course to their list enrolled courses
//             const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id: userId},
//                                                 {$push: {courses: courseId}},
//                                                 {new: true},
//             );
//             console.log(enrolledStudent);

//             // mail send krdo confirmation wala

//             const emailResponse = await mailSender(
//                                     enrolledStudent.email,
//                                     "Congratulation from Ed-Tech Company",
//                                     "Congratulation, for choosing Ed-Tech",
//             );
//             console.log(emailResponse);

//             return res.status(200).json({
//                 success: true,
//                 message: "Signature verified and Course Added"
//             })
//         } 
//         catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: error.message,
//             })
//         }
//     }
//     else{
//         return res.status(400).json({
//             success: false,
//             message: "Invalid Request"
//         });
//     }
// };  







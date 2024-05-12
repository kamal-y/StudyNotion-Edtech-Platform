// const OTP = require('../models/OTP');
const OTP = require('../models/OTP');
const User = require('../models/User');
const Profile = require('../models/Profile');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
const {mailSender} = require("../utils/mailSender");
require("dotenv").config();


//---------------------------------------------------------signup------------------------------------------------------------
// Signup controller for Registering users

exports.signUp = async(req, res) => {

    try {
        // Destructure fields form req Body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,   //Most recent otp 
        } = req.body;

        // Validate Krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword  || !otp){
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            })
        }

        // Password and confirm Password match krlo
        if(password !== confirmPassword){
            res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword does not match, Please Try again",
            });
        }

        // Check User already present or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).json({
                success: false,
                message: 'User is Already Register',
            });
        }

        // Find most Recent OTP stored for the user  ----- Why OTP ???????
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("Recent OTP", recentOtp);

        // Validate OTP
        console.log(" otp---->>>>",otp);
        if(recentOtp.length === 0){
            // OTp not found
            console.log("Inside if-->", otp);
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid'
            })
        }
        //recentOtp[0].otp --> ??????
        //(otp !== recentOtp) --> Why not this
        else if(otp !== recentOtp[0].otp){
            console.log("Inside if-else-->", otp);
            return res.status(400).json({
                success: false,
                message: 'The OTP is not Valid',
            });
        }
        console.log(" otp---->>>>1",otp);

        // Hash Password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create the user 
        // Why below two Lines??????
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = false);

        // Profile details ka zarurat isliye hua hai ki user mai additionalDetails ka use hua hai
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        // Create DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`, 
        });

        // Return Response
        return res.status(200).json({
            success: true,
            message: 'User is Registered Successfully',
            user,
        })

        
        
    } 
    catch (error) {
        console.log("Error--->",error.message);
        return res.status(500).json({
            success: false,
            message: 'User connot be registered, Please Try again',
        })
    }
}

//-------------------------------------------------------------- login--------------------------------------------------------
// Login controller for Authenticating Users
exports.login = async(req, res) => {

    try {
        //fetch Data from req body
        const {email, password} = req.body;

        // Validate Data
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'All fields are Required'
            })
        }

        // check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: "User is not Register, Please Signup first",
            });
        }

        // Generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)){

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(
                payload, 
                process.env.JWT_SECRET, 
                {expiresIn: '24h'}
            );

            // Save token to user document to database
            user.token = token;
            // password ko hide krna pada hai
            user.password = undefined;

            //  cookie Generate
            // Set cookie for token and return success response
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,

            }
            // Refer internet for better Understanding
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Successfully",
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Password is Incorrect'
            })
        }

    } 
    catch (error) {
        console.log(error);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success: false,
            message: "Login Failure, Please try Again",
        }); 
    }
}


// 1 -> 2 Middleware
//--------------------------------------------------------------send otp-------------------------------------------------------
//---------------------------------------------------- To verify the email---------------------------------------------------- 
exports.sendOTP =  async(req, res) => {

    try {
        // Fetch email from req body
        const {email} = req.body;

        // Find user with Provided Email
        const checkUserPresent = await User.findOne({email});

        // check user already present, if yes then send response
        if(checkUserPresent){
            // Unauthorized Status
            res.status(401).json({
                success: false,
                message: 'User Already Present'
            });
        }

        // If user is not present Generate OTP
        // User not Present means User is signing up first time 
        // And Verifying the provided emails, so generate OTP to verify the email
        // Default --> Numbers
        var otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false, 
            lowerCaseAlphabets: false,
            specialChars: false 
        });
        console.log("Otp Generated");

        // check unique OTP or not {otp : otp} => same hai toh wapas Generate kro
        const result = await OTP.findOne({otp : otp});  

        // Agar woo unique nahi hai toh wapas generate krna pad raha hai
        // Loop mai Check kr raha hai 
        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            // result = await OTP.findOne({otp : otp}); 
        }

        // Database mai Otp Daal do
        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);

        // Send Response
        res.status(200).json({
            success: true,
            message: 'Otp Sent Successfully',
            otp,
        });
    }  
    catch (error) {
       console.log(error);
       return res.status(500).json({
            success: false,
            message: error.message
       });
    }
}


//---------------------------------------------------- changepassword ---------------------------------------------------------

exports.changePassword = async(req, res) => {

    try {
        // Get User data fron req.body
        // Payload mai se User id nikala hai
        const userDetails = await User.findById(req.user.id);

        //Get Old password, new password, confirm password from req body
        const {oldPassword, newPassword, confirmPassword} = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password,
        );
        // Validation
        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: "The password is Incorrect",
            });
        }

        //Match new Password and confirm new Password
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            })
        }

        // Update password in Db
        const encryptPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password: encryptPassword},
            {new: true}
        )
        // console.log(updatePassword);

        //Send mail --> Password updated
        //await mailSender(email, "Password Updated");
        // Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.recentOtp);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

        // Return Response
        return res.status(200).json({
            success: true,
            message: "Password Changed"
        })
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occured while updating password", 
            error: error.message
        });    
    }
}
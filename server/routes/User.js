const express = require("express");
const router = express.Router();

const {login, signUp, sendOTP, changePassword} = require("../controllers/Auth");

const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth");

//-----------------------------------------------------Authentication routes---------------------------------------------------------

// Route for user Login
router.post("/login", login);

// Route for user Signup
router.post("/signup", signUp); 

// Route for sending OTP to yhe users email
router.post("/sendotp", sendOTP);

// Route for Changing the Password
router.post("/changepassword", auth, changePassword);


//----------------------------------------------------Reset Password---------------------------------------------------------------------

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router;

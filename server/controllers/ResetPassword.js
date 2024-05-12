const User = require('../models/User');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { mailSender } = require('../utils/mailSender');

//------------------------------------------------------- resetPasswordToken--------------------------------------------------


exports.resetPasswordToken = async(req, res) => {
    
    try {
        // Get email from req body
        const {email} = req.body;

        // check user for this email, email validation
        const  user = await User.findOne({email: email});
        if(!user){
            return res.json({
                success: false,
                message: 'Your Email is not Registered with us'
            })
        }

        // token Generate
        const token = crypto.randomUUID();

        // Update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                                        {email: email}, 
                                                        {
                                                            token: token,
                                                            resetPasswordExpires: Date.now() + 3600000, 
                                                        }, 
                                                        {new: true});
                                                    
                                                    

        // Create url
        // Alag alag token ki value se alag alag link banta jaega frontend pe redirect krne ke liye
        const url = `http://localhost:3000/update-password/${token}`;

        // send mail containing url
        await mailSender(email, 
                        "Password Reset Link",
                        `Password Reset Link: ${url}` 
                    );

        // Return Response
        return res.json({
            success: true,
            message: "Email sent Successfully, please Check Email and Change Password",
        });    
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, while resetting password"
        })
    }
}


//------------------------------------------------------- resetPassword-------------------------------------------------

exports.resetPassword = async(req, res) => {
    try {
        //data fetch
        const {password, confirmPassword, token} = req.body;

        // validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: 'Password does not Match'
            });
        }

        // get user details from db using token
        const userDetails = await User.findOne({token: token})
        // if no entry - invalid token
        if(!userDetails){
            return res.json({
                success: false,
                message: 'Token is Invalid'
            })
        }

        // token time check 
        // here Token is Expired
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token is Expired, please Regenerate your Token", 
            })
        }

        // hash password
        const  hashedPassword = await bcrypt.hash(password, 10);

        // password update
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true},
        )
        // response return  
        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"    
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending password mail",
        })
    }
}
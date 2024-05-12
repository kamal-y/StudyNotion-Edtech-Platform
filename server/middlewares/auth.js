const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// 2 -> 3. Course
//------------------------------------------------------- Auth --------------------------------------------------------
// Extract token kiya tabhi pata chalega ki payload mai Student hai ki Instructor hai ya Visitor hai

exports.auth = async(req, res, next) => {
    try {

        
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        console.log("Andar kyu nahi ja raha hai???");
        console.log("Token aa raha hai kya-->", token);

        // If token Missing,then Return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is Missing",
            });
        }

        // Verify Token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;    
        } 
        catch (error) {
            // Verification-->  issue
            return res.status(401).json({
                success: false,
                message: "Token is Invalid"
            })
        }
        next();

    } 
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "1Something went wrong while validating the token ?????",
        })
    }
}

// -------------------------------------------------------------isStudent------------------------------------------------

exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: 'This is a Protected Route for Student Only',
            })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })    
    }
}

// --------------------------------------------------------isInstructor---------------------------------------------------------

exports.isInstructor = async(req, res, next) => {
    try {
        console.log("Account Type", req.user.accountType);
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: 'This is a Protected Route for Instructor Only',
            })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })    
    }
}

//---------------------------------------------------------- isAdmin-------------------------------------------------------------

exports.isAdmin = async(req, res, next) => {
    try {
        console.log("Account Type", req.user.accountType);
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: 'This is a Protected Route for Admin Only',
            })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })    
    }
}
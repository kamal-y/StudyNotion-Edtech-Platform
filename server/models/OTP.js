const mongoose = require("mongoose");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const { mailSender } = require("../utils/mailSender");


const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60*5, //Document aapne aap delete ho jaega 5 min baad after its creation
    }
});

//---------------------------------------------- A Function to Send Email--------------------------------


async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(
            email, 
            "Verification Email", 
            emailTemplate(otp)
        );
        console.log("Mail sent Successfully : ", mailResponse.response);
    } 
    catch (error) {
        console.log("Error Occur while Sending mails : ",error);
        throw error;
    }
}


//------------------------------ PRE/POST --> Middleware ---> OTP ke Liye ------------------------------ 
// Pre/post---> Middleware ---> Schema or Model ke Bich mai Define krte hai


OTPSchema.pre("save", async function(next){
    console.log("New document saved to database");

    // Only send an email when a new document is created
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

// ----------------------------------------------------------------

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;


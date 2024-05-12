const Razorpay = require('razorpay');

// Razor pay Configuration
exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
    headers:""
})


// var instance = new Razorpay({
//     key_id: "YOUR_KEY_ID",
//     key_secret: "YOUR_KEY_SECRET",
//     headers: {"X-Razorpay-Account": "acc_Ef7ArAsdU5t0XL"} 
//   });
  
//   instance.orders.create({
//   "amount": 50000,
//   "currency": "INR",
//   "receipt": "rcptid_11"
//   })
const express = require("express");
const {connectToDatabase} = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");    
const contactUsRoute = require("./routes/Contact");

const app = express();

// MiddleWares
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({extended: true}));
app.use(
    cors({
        origin: "https://studynotion-cyan.vercel.app",
        credentials: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

cloudinaryConnect();

// Connection to Database
connectToDatabase();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);


// Server Initializing

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is Connected at PORT : ${PORT}`)
});

// Dummy Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Your server is up and Running...."
    });
})
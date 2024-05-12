const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    CompletedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection"
        }
    ],
},{ strictPopulate: false });

module.exports = mongoose.model("courseProgress", courseProgress);
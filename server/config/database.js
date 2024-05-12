const mongoose = require("mongoose");
require("dotenv").config();

exports.connectToDatabase = (req, res) => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connect to Database"))
    .catch((error) => {
        console.log("Cannot Connected to the Database");
        console.error(error);
        process.exit(1);
    });
}


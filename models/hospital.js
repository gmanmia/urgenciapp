var mongoose = require("mongoose");

// SCHEMA Setup
var hospitalSchema = new mongoose.Schema({
    name: String,
    capacity: Number,
    address: String,
    wait: Number,
    logo: String,
    rating: Number,
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report"
        }
    ],
    alias: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Hospital", hospitalSchema);
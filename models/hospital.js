var mongoose = require("mongoose");

var hospitalSchema = new mongoose.Schema({
    name: String,
    capacity: Number,
    wait: Number,
    logo: String,
    rating: Number,
    address: String,
    lat: Number,
    lng: Number,
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
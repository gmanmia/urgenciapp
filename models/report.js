var mongoose = require("mongoose");

// Schema setup

var reportSchema = new mongoose.Schema({
    alias: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    triageLevel: Number,
    arrivalTime: String,
    seenTime: String,
    comments: String,
    created: {type: Date, default: Date.now},
    checkIn: Date,
    checkOut: Date,
    openStatus: {type: Boolean, default: true}
});

module.exports = mongoose.model("Report", reportSchema);
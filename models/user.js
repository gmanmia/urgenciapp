var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    isAdmin: {type: Boolean, default: false},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    about: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true,
    },
    lastName: {
        type: String,
        minlength: 1,
        maxlength: 30,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 8,
    },
    age: {
        type: Number,
        min: 16,
        max: 100,       
    },
    gender: {
        type: String,
        trim: true,
       enum: {
        values: ["male","female","other"],
        message: "Please select male, female or other"
       },
       default: "male"
    },
},{timestamps: true})

module.exports = mongoose.model("User",userSchema);
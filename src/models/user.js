const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
    },
},{timestamps: true})

userSchema.methods.getJWT = function(){
    const token = jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn: "1d",
    })
    return token;
}

userSchema.methods.comparePassword = function(password){
   const isPasswordValid = bcrypt.compare(password, this.password);
   return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);
const validator = require("validator")

const validation = (req)=>{

    if(!req.body || typeof req.body !== "object" || Array.isArray(req.body)){
        throw new error("Invalid request body");
    }

    const {firstName, lastName, emailId, password} = req.body;
    
    const allowedFields = [
        "firstName",
        "lastName",
        "emailId",
        "password"
    ]

    const isAllowed = Object.keys(req.body).every(field => allowedFields.includes(field));

    if(!isAllowed){
        throw new Error("invalid signup fields")
    }

    if(!firstName || !emailId || !password){
        throw new Error("firstname, emailid and password are required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Email id must be valid");
    }
    if(typeof password !== "string" || !validator.isStrongPassword(password) || Buffer.byteLength(password,"utf-8")>72){
        throw new Error("Invalid or weak Password");
    }

}

const validateEditProfileData = (req)=>{
    const allowedEditFields = ["firstName","lastName","age","gender"];
    const isAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
    return isAllowed;

}

module.exports = { validation, validateEditProfileData};
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user')

const userAuth = async(req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
          throw new Error("Please login first");
        }
    
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // console.log(decoded);
    
        const userId = decoded.id;
        const user = await User.findById(userId);
        if(!user){
            throw new error("user is not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).json({
            success: false,
            error: err.message 
        });
    }
}

module.exports = {userAuth}
const express = require("express");
const validation = require("../utils/validation");
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/user")

router.post("/signup", async (req,res)=>{
 try{
    
    validation(req);

    const {firstName, lastName, emailId, password} = req.body;

    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashPassword
    })

    await user.save();
    res.send("Data sent successfully");
  }catch(err){
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
})

router.post("/login", async (req,res)=>{
  try{

    const {emailId, password} = req.body;

    if (
      typeof emailId !== "string" ||
      typeof password !== "string" ||
      !emailId.trim() ||
      !password
    ) {
      return res.status(400).send(
        "Email and password are required"
      );
    }

    const user = await User.findOne({emailId});

    if(!user){
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = user.comparePassword(password);


    if(isPasswordValid){

      const token = user.getJWT();

      res.cookie('token',token);
      res.status(200).send("Login successfull!!!");
    }else{
      throw new Error("Invalid Credentials");
    }
    

  }catch(err){
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
})

module.exports = router;
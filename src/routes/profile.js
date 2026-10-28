const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt")
const router = express.Router();
const validator = require('validator')

router.get('/profile/view',userAuth, async(req,res)=>{
  try{

    const user = req.user;

    res.status(200).send(user);

  }catch(err){
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
})

router.patch('/profile/edit', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        if(!validateEditProfileData){
            throw new Error("Invalid fields for the edits")
        }
        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
        await loggedInUser.save();
        res.status(200).json({
            message: "Edit successfull",
            data: loggedInUser,
        })
    }catch(err){
    res.status(400).json({
      success: false,
      error: err.message
    });
  }

})

router.patch('/profile/password', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {oldPassword, newPassword} = req.body;
        const isPasswordValid = await loggedInUser.comparePassword(oldPassword);
        if(!isPasswordValid){
            throw new Error("Enter the correct Password")
        }
        if(typeof newPassword !== "string" || !validator.isStrongPassword(newPassword) || Buffer.byteLength(newPassword,"utf-8")>72){
            throw new Error("Invalid or weak Password");
        }
        loggedInUser.password = await bcrypt.hash(newPassword, 12);
        await loggedInUser.save();
        res.status(200).json({
            message: "password updated successfully",
        })
    }catch(err){
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
})

module.exports = router;
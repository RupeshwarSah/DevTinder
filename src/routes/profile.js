const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router()

router.get('/profile',userAuth, async(req,res)=>{
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

module.exports = router;
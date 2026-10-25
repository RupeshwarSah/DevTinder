const express = require("express");
const connectDb = require("./config/database")
const User = require("./models/user")
const app = express();
const validator = require("validator")
const validation = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res)=>{
 
  try{
    
    validation(req);

    // encrypting the password

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

app.post("/login", async (req,res)=>{
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

    const hashPassword = user.password;

    const isPasswordValid = await bcrypt.compare(password, hashPassword);


    if(isPasswordValid){

      const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{
    expiresIn: "1d",
    })

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

app.get('/profile', async(req,res)=>{
  try{

    // console.log(req.cookies);

    const token = req.cookies.token;
    if(!token){
      throw new Error("Please login first");
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decoded);

    const userId = decoded.id;
    const user = await User.findById(userId);

    res.status(200).send(user);

  }catch(err){
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
})

app.get("/users", async(req,res)=>{

  try{
    const user = await User.find({emailId: req.body.emailId});
    if(user.length===0){
      res.status(404).send("No user found")
    }
    res.send(user);

  }catch(err){
    res.status(500).send(err);
  }
})

app.get("/feed", async(req, res)=>{
  try{
    const user = await User.find({});
    if(user.length === 0){
      res.status(404).send("No user exists")
    }
    res.send(user);
  }catch(err){
    res.status(500).send(err);
  }
})

app.delete("/users", async(req,res)=>{
  const userId = req.body.userId;
  try{
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }catch(err){
    res.status(500).send(err);
  }
})

app.patch("/users", async(req,res)=>{
  const userId = req.body.userId;
  const data = req.body;
  try{
    const user = await User.findByIdAndUpdate(userId, data)
    res.send("user updated successfully");
  }catch(err){
    res.status(500).send(err)
  }
})

connectDb().then(()=>{
    console.log("Database connection established")
    app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
}).catch(err=>{
    console.log("Database cannot be connected")
})




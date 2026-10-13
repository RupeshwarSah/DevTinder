const express = require("express");
const connectDb = require("./config/database")
const User = require("./models/user")
const app = express();

app.use(express.json());


app.post("/signup", async (req,res)=>{

  // static way of creating the user instance
  // const user = new User({
  //   firstName: "Rupeshwar",
  //   lastName: "Sah",
  //   emailId: "dummy@gmail.com",
  //   password:  "abcdefgh",
  // })

  // dynamic way of creating the user instance
  const user = new User(req.body)

  try{
    await user.save();
    res.send("Data sent successfully");
  }catch(err){
    res.status(400).send("Error saving the user: ", err);
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

connectDb().then(()=>{
    console.log("Database connection established")
    app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
}).catch(err=>{
    console.log("Database cannot be connected")
})




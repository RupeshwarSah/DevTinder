const express = require("express");
const connectDb = require("./config/database")
const User = require("./models/user")
const app = express();


app.post("/signup", async (req,res)=>{
  const user = new User({
    firstName: "Rupeshwar",
    lastName: "Sah",
    emailId: "dummy@gmail.com",
    password:  "abcdefgh",
  })
  await user.save();
  res.send("Data sent successfully");
})

connectDb().then(()=>{
    console.log("Database connection established")
    app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
}).catch(err=>{
    console.log("Database cannot be connected")
})




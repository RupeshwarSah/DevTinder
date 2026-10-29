const express = require("express");
const connectDb = require("./config/database")
const User = require("./models/user")
const app = express();
const cookieParser = require("cookie-parser")
require('dotenv').config();
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

app.use(express.json());
app.use(cookieParser());


app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)


connectDb().then(()=>{
    console.log("Database connection established")
    app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
}).catch(err=>{
    console.log("Database cannot be connected")
})




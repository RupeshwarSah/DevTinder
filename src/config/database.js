require('dotenv').config();
const mongoose = require("mongoose")

const DB_URL = process.env.MONGO_URL;

if (!DB_URL) {
  throw new Error("MONGO_URI is missing");
}

const connectDb = async()=>{
    await mongoose.connect(DB_URL);
}

module.exports = connectDb;


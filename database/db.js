const mongoose = require("mongoose")
require("dotenv").config()
const color = require("colors")


const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.URL)
        console.log("mongodb connected".bgGreen.red)
    }catch(error){
        console.log("connection to db error",error)
    }
}

module.exports = connectDB
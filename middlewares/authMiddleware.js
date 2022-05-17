const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
require("dotenv").config()


const protect = asyncHandler(async (req,res,next) => {
    let tocken
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        tocken = req.headers.authorization.split(" ")[1]
        try{
            const decoded = await jwt.verify(tocken,process.env.SECERET_KEY)
            req.user = await User.findById(decoded.id).select("-password")
            next()
        }catch(error){
            res.status(400)
            throw new Error("Not Authorized Tocken Failed")
        }
    }

    if(!tocken){
        res.status(400)
        throw new Error("No Tocken")
    }

})


module.exports = protect


const asyncHandler = require("express-async-handler")
const generateTocken = require("../database/generateTocken")
const User = require("../models/userModel")


const registerUser = asyncHandler(async (req,res) => {
    let {name,email,password,pic} = req.body

    if(!name || !email || !password){
        res.status(400).json({message:"olease Enter All the fiels"})
        throw new Error("Pleease Enter All The Fields")
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400).json({message:"User already exists"})
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            isAdmin:user.isAdmin,
            tocken:generateTocken(user._id),
            message:"Signup successfull"
        })
    }else{
        res.status(400).json({message:"failed to create user"})
        throw new Error("Failed to Create User")
    }

})



const authUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body

    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            pic:user.pic,
            tocken:generateTocken(user._id),
            message:"Login SuccessFull"
        })
    }else{
        res.status(400)
        throw new Error("Invalid Email or Password")
    }


})




const allUser = asyncHandler(async (req,res) => {
    let keyWord = req.query.search ? {
        $or : [
            {name:{$regex : req.query.search,$options : "i"}},
            {email: {$regex : req.query.search , $options : "i"}}
        ]
    } : {}

    let users = await User.find(keyWord).find({_id:{$ne:req.user._id}})
    res.send(users)
})



module.exports = {registerUser,authUser,allUser}
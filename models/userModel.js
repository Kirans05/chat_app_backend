const bcryptjs = require("bcryptjs")
const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

userModel.methods.matchPassword = async function(password) {
    return await bcryptjs.compare(password,this.password)
}


userModel.pre("save",async function(next){
    if(!this.isModified){
        next()
    }
    let salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password,salt)
})


const User = mongoose.model("User",userModel)

module.exports = User
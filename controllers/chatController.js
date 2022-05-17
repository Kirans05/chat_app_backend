const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel") 
const User = require("../models/userModel")



const accessChat = asyncHandler(async (req,res) => {
    let {userId} = req.body
    if(!userId){
        console.log("userId not sent with Request")
        return res.status(400)
    }

    let isChat = await Chat.find({
        isGroupChat : false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    })
    .populate("users","-password")
    .populate("latestMessage")

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name email pic"
    })
    if(isChat.length){
        res.json(isChat[0])
    }else{
        let chatData = {
            chatName :"Sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        }


        try{
            let createdChat = await Chat.create(chatData)
            let FullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password")
            res.status(200).json(FullChat)
        }catch(error){
            res.status(400)
            throw new Error(error.message)
        }

    }

})



const fetchChat = asyncHandler(async (req,res) => {
    try{
        let result = await Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password") 
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        let finalResult = await User.populate(result,{
            path:"latestMessage.sender",
            select:"name email pic"
        })
        res.status(200).send(finalResult)
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})


const groupChat = asyncHandler(async (req,res) => {
    if(!req.body.name || !req.body.users){
        return res.status(400).send({message:"please fill all the fields"})
    }

    let users = JSON.parse(req.body.users)

    if(users.length < 2){
        return res.status(400).json({message:"more than 2 users are required to create group Chat"})
    }

    users.push(req.user)

    let chatData = {
        chatName : req.body.name,
        isGroupChat: true,
        users:users,
        groupAdmin : req.user
    }
    try{
        let createGroupChat = await Chat.create(chatData) 
        let fullGroupChat = await Chat.findOne({_id:createGroupChat._id}).populate("users","-password")
        .populate("groupAdmin","-password")
        res.status(200).send(fullGroupChat)

    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})


const renameChat = asyncHandler(async (req,res) => {
    let {chatId, chatName} = req.body

    let renamedChat = await Chat.findByIdAndUpdate(
        chatId,
        {chatName},
        {new:true}
    ).populate("users","-password")
    .populate("groupAdmin","-password")

    if(!renamedChat){
        res.status(400)
        throw new Error("Chat not found")
    }else{
        res.status(200).json(renamedChat)
    }
})


const addToGroup = asyncHandler(async (req,res) => {
    let {chatId , userId} = req.body

    let addedToGroup = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },
        {
            new:true
        }
    ).populate("users","-password")
    .populate("groupAdmin","-password")
    
    if(!addedToGroup){
        res.status(400)
        throw new Error("chat not found")
    }else{
        res.status(200).json(addedToGroup)
    }

})



const removeFromGroup = asyncHandler(async (req,res) => {
    let {chatId, userId} = req.body
    console.log("req.body",chatId,userId)
    let removed = await Chat.updateOne({_id:chatId},{$pull:{users:userId}})
    .populate("users","-password")
    .populate("groupAdmin","-password")
        console.log("removed",removed)

    if(!removed){
        res.status(400)
        throw new Error("chat not found")
    }else{
        res.status(200).json(removed)
    }
})


  module.exports = {accessChat, fetchChat, groupChat, renameChat, addToGroup, removeFromGroup}
const asyncHandler = require("express-async-handler")
const Chat = require("../models/chatModel")
const Message = require("../models/messageModel")
const User = require("../models/userModel")


const sendMessage = asyncHandler(async (req,res) => {
    const {content, chatId} = req.body

    if(!content || !chatId){
        console.log("invalid request")
        return res.status(400)
    }

    let newMessage = {
        sender:req.user._id,
        content: content,
        chat : chatId
    }


    try{
        let message = await Message.create(newMessage)
        message = await message.populate("sender","name pic email")
        message = await message.populate("chat")
        message = await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })

        await Chat.findByIdAndUpdate(
            req.body.chatId,
            {latestMessage:message},
            // {new:true}
            )

            res.json(message)
    }catch(error){
        console.log("error sending message to database")
        res.status(400)
        throw new Error(error)
    }

})



const allMessages = asyncHandler(async (req,res) => {
    try{
        let messages = await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")
        res.json(messages)
    }catch(error){
        res.status(400)
    }
})



module.exports = {sendMessage, allMessages}
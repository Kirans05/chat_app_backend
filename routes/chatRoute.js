const express = require("express");
const router = express.Router()
const {accessChat, fetchChat, groupChat, renameChat, addToGroup, removeFromGroup} = require("../controllers/chatController")
const protect = require("../middlewares/authMiddleware")



router.route("/").post(protect,accessChat)
router.route("/fetchchat").get(protect,fetchChat)
router.route("/group").post(protect,groupChat)
router.route("/rename").put(protect,renameChat)
router.route("/addToGroup").put(protect,addToGroup)
router.route("/removeUser").put(protect,removeFromGroup)





module.exports = router



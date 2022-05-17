const express = require("express")
const {registerUser,authUser, allUser} = require("../controllers/userControllers")
const protect = require("../middlewares/authMiddleware")
const router = express.Router()



router.route("/").post(registerUser)
router.route("/login").post(authUser)
router.route("/").get(protect,allUser)


module.exports = router
const express = require("express")
const routes = express.Router()
const {register,loggin,authInfo,userInfo,loggedOut,refreshAccessToken} = require("../controllers/auth.controller.js")
const verifyToken = require("../middleware/auth.middleware.js")


routes.post("/register",register)
routes.post("/login",loggin)
routes.post("/logout",verifyToken,loggedOut)
routes.get("/authinfo",verifyToken,authInfo)
routes.get("/userinfo/:id",verifyToken,userInfo)
routes.post("/refreshtoken",verifyToken,refreshAccessToken)


module.exports = routes
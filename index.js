const express = require("express")
const morgan = require("morgan")
const colors = require("colors")
const bodyparser = require("body-parser")
const connectDB = require("./config/DB_Connect.js")
const authRoutes = require("./routers/auth.route.js")
const cookieParser = require("cookie-parser")
const cors = require("cors")

// config
require("dotenv").config();
const app = express()
const PORT = process.env.PORT || 5000

// connect database
connectDB()

// middleware
app.use(bodyparser.json())
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

// routes
app.use("/api/v1/auth",authRoutes)

// server
app.listen(PORT,()=>{
    console.log(`server is running on PORT : ${PORT}`.yellow)
})



import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import fileUpload from "express-fileupload";
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary"
import { dbConnection } from "./database/db.js";
import userRoute from "./router/userRouter.js"

const app = express()
config({ path: '.env' })

const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Hello World"
    })
})

// routes
app.use('/api/v1/user', userRoute)

dbConnection()

app.listen(PORT, () => {
    console.log("server is running at port: ", PORT)
})

// error handler middleware
app.use((err, req, res, next) => {
    console.error("error:", err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

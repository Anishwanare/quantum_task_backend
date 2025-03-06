import { User } from "../model/userMode.js";
import { catchAsyncError } from "./catchAsynError.js";
import jwt from 'jsonwebtoken'

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.User_Token
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Please login.."
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token Invalid or Expired"
        })
    }
})
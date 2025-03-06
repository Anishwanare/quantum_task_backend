import { catchAsyncError } from "../middleware/catchAsynError.js";
import { User } from "../model/userMode.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

export const register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, dob, email, password } = req.body;

        if (!name || !dob || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All details are required",
            });
        }

        if (isNaN(Date.parse(dob))) {
            return res.status(400).json({
                success: false,
                message: "Invalid date of birth",
            });
        }

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists in the system.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            dob,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong, try again!",
            error: error.message,
        });
    }
});



export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Fill full form."
        });
    }

    const checkUser = await User.findOne({ email }).select("+password");
    if (!checkUser) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });

    res.json({
        success: true,
        message: "Login Successful",
        user: checkUser,
        token
    });
});
    


export const fetchUsers = catchAsyncError(async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            message: "Something went wrong, try again"
        })
    }
})
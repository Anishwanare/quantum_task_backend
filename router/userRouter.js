import express from "express"
import { fetchUsers, login, register } from "../controller/userController.js"
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/fetch", fetchUsers)

export default router
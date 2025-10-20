import express from "express"
import { signup,login,logout } from "../controllers/auth.controller"
import { userValidator } from "../../validators/rules/user.validators"
import { validate } from "../../validators/validate"
import { verifyToken } from "../middlewares/verifyToken"


const router=express.Router()

router.post('/signup',userValidator.signup,validate,signup)
router.post('/login',userValidator.login,validate,login)
router.post('/logout',verifyToken,logout)


export default router
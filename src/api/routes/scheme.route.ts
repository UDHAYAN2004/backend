import express from "express"
import { createScheme, updateScheme } from "../controllers/scheme.controller"
import { schemeValidator } from "../../validators/rules/schema.validators"
import { validate } from "../../validators/validate"
import { verifyToken } from "../middlewares/verifyToken"

const router=express.Router()

router.post('/create-scheme',schemeValidator.create,validate,verifyToken,createScheme)
router.put('/update-scheme/:id',schemeValidator.update,validate,verifyToken,updateScheme)


export default router
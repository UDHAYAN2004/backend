import express from "express"
import { createScheme, updateScheme, deleteScheme, 
getSchemeById,getAll,getByCategory,getCategoryCount } from "../controllers/scheme.controller"
import { schemeValidator } from "../../validators/rules/schema.validators"
import { validate } from "../../validators/validate"
import { verifyToken } from "../middlewares/verifyToken"
import { isAdmin } from "../middlewares/isAdmin"

const router=express.Router()
router.post('/create-scheme',schemeValidator.create,validate,verifyToken,isAdmin,createScheme)
router.put('/update-scheme/:id',schemeValidator.update,validate,verifyToken,isAdmin,updateScheme)
router.delete('/delete-scheme/:id',verifyToken,isAdmin,deleteScheme)

//================fetching particular scheme
router.get('/get-scheme/:id',verifyToken,getSchemeById)
//========================= get all schemes
router.get('/get-all-schemes',verifyToken,getAll)
//======================== get schemes by category
router.get('/get-schemes-by-category/:category',verifyToken,getByCategory)
router.get('/get-category-count',verifyToken,getCategoryCount)

export default router
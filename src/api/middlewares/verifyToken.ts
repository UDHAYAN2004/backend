import {Request,Response,NextFunction}from "express"
import jwt from "jsonwebtoken"


export interface AuthRequest extends Request{
    user?:any
}

export const verifyToken = (req:AuthRequest,res:Response, next: NextFunction)=>{
    try {
         const authHeader= req.headers.authorization;
          if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({error:"No token Provided"})
          }
          const token=authHeader.split(" ")[1]
          const decode = jwt.verify(token,process.env.JWT_SECRET || "secret");
          req.user=decode
          next()
    } catch (error:any) {
        return res.status(401).json({success:false,message:"Invalid or expired token"})
    }
   
}
 

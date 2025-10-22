import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {User} from "../../models/user"
import {Request,Response} from "express"
import { addToBlackList } from "../utils/blacList"


export const signup=async(req:Request,res:Response)=>{
  try{
    console.log("Received body:",req.body)
      const{name,userName,password,role,email,phone,state}=req.body
    const isExist=await User.findOne({where:{email}})
    if(isExist){
        return res.status(400).json(
        {
         success:false,
         message:"User Already Exists"})
    }
    
    const hashedPassword= await bcrypt.hash(password,10)
    const newUser=await User.create({name,userName,password:hashedPassword,role:role || "User",email,phone,state})
    if(newUser && newUser.id){
        return res.status(200)
        .json({
        success:true,    
        message:"Account Created Successfully"})
    }
   }
      catch(err:any){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;

    // Find the user
    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Password mismatch" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role}, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });

    // Strip sensitive info from user
    const { password: pw, ...safeUser } = user.dataValues;

    // Set HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,                    // cannot be accessed by JS
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",                 // CSRF protection
      maxAge: 24 * 60 * 60 * 1000,       // 1 day
    });

    // Send response (without token in body)
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: safeUser,
      token
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    
    });
  }
};

export const logout = async(req:Request, res:Response)=>{
  try{
    const authHeader=req.headers.authorization
    if(!authHeader){
      return res.status(401).json({
        success:false,
        error:"No Token Provided"
      })
    }
    const token=authHeader?.split(" ")[1]
    if(!token){
        return res.status(400).json({success:"false",error:"InValid Token format"})
    }
    const decoded:any=jwt.decode(token)
    const currentTime=Math.floor(Date.now()/1000)
    const expirySeconds= decoded?.exp ? decoded?.exp-currentTime: undefined;
    addToBlackList(token,expirySeconds)
    res.clearCookie("token")
    return res.status(200).json({
      success:true,
      message:"Logged Out Successfully"
    })
  }
  catch(err:any){ 
    return res.status(500).json({
      success:false,
      error:err.message
    })
  }
}
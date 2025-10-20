import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {User} from "../../models/user"
import {Request,Response} from "express"
import { AuthRequest } from "../middlewares/verifyToken"

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const id=req.user?.id
    const { name, userName, email, community, state, phone } = req.body;

    //Find the user by ID
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if username already exists in another user
    const isExist = await User.findOne({ where: { userName } });
    if (isExist && isExist.id !== id) {
      return res.status(400).json({ error: "Username already Exist" });
    }

    // Update user
    const [affectedRows] = await User.update(
      { name, userName, email, community, state, phone },
      { where: { id } }
    );

    //  Handle no rows updated (could be same data)
    if (affectedRows === 0) {
      return res.status(200).json({
        isUpdate: false,
        error: "Profile is not Updated, Something went wrong",
      });
    }

    // Success
    return res.status(200).json({
      isUpdate: true,
      message: "User Updated Successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // The user ID comes from token payload
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Invalid user token" });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const plainUser = user.get({ plain: true });
    const { password, ...safeUser } = plainUser;

    return res.status(200).json({
      success: true,
      user: safeUser
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
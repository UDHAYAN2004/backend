import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Represents data stored in your JWT token (NOT the request)
export interface AuthUser {
  id: string;
  role: string;
  email?: string;
  userName?: string;
}

// Extends the Express Request object to include the user
export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Decode and cast to AuthUser type
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as AuthUser;

    // Attach decoded user info to request
    req.user = decoded;

    next();
  } catch (error: any) {
    console.error("JWT Error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

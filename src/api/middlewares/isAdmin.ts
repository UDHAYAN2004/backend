import { Request, Response, NextFunction } from "express";
import { toCapitalize } from "../utils/capitalization";
import { AuthUser } from "./verifyToken";

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const role = req.user?.role;

  // Step 1: Ensure user has a role
  if (!role) {
    return res.status(403).json({
      success: false,
      message: "Access denied. No role found.",
    });
  }

  // Step 2: Normalize and compare
  const normalizedRole = toCapitalize(role); // e.g., "admin" → "Admin"

  if (normalizedRole !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  // Step 3: Allow the request to continue
  next();
};

import { Request, Response, NextFunction } from "express";
import { toCapitalize } from "../utils/capitalization";

export interface AuthRequest extends Request {
  user?: any;
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const role = req.user?.role; // directly get the role

  // if (!role) {
  //   return res.status(403).json({
  //     success: false,
  //     message: "Access denied. No role found.",
  //   });
  // }

  // Normalize the role (e.g., "admin", "Admin", "ADMIN" → "Admin")
  const normalizedRole = toCapitalize(role);

  if (normalizedRole !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only",
    });
  }

  next();
};

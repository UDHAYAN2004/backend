import { validationResult,ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err:ValidationError|any) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

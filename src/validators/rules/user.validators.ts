import { body } from "express-validator";
import { User } from "../../models/user";
import { Op } from "sequelize";

// Common reusable validation rules
const baseRules = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Signup Validator
export const userValidator = {
  signup:[
  ...baseRules,

  body("userName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .bail()
    .custom(async (userName) => {
      const user = await User.findOne({ where: { userName } });
      if (user) throw new Error("Username already exists");
      return true;
    }),

  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .bail()
    .custom(async (email) => {
      const user = await User.findOne({ where: { email } });
      if (user) throw new Error("Email already exists");
      return true;
    }),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 12 })
    .withMessage("Phone number must be 10–12 digits")
    .bail()
    .custom(async (phone) => {
      const user = await User.findOne({ where: { phone } });
      if (user) throw new Error("Phone number already exists");
      return true;
    }),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),
],

// Login Validator
login:[
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
],

//Profile Update Validator (context-aware)
profileValidator : [
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("userName")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .bail()
    .custom(async (userName, { req }) => {
      const existing = await User.findOne({
        where: { userName, id: { [Op.ne]: req.user?.id } },
      });
      if (existing) throw new Error("Username already exists");
      return true;
    }),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email")
    .bail()
    .custom(async (email, { req }) => {
      const existing = await User.findOne({
        where: { email, id: { [Op.ne]: req.user?.id } },
      });
      if (existing) throw new Error("Email already exists");
      return true;
    }),

  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 12 })
    .withMessage("Phone number must be 10–12 digits")
    .bail()
    .custom(async (phone, { req }) => {
      const existing = await User.findOne({
        where: { phone, id: { [Op.ne]: req.user?.id } },
      });
      if (existing) throw new Error("Phone number already exists");
      return true;
    }),
]};

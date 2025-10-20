import { body } from "express-validator";
import { Scheme } from "../../models/schemes";
import { Op } from "sequelize";

// Common helper to validate string arrays
const isStringArray = (arr: any) =>
  Array.isArray(arr) && arr.every((item) => typeof item === "string" && item.trim().length > 0);

export const schemeValidator = {
  create: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters")
      .bail()
      .custom(async (title) => {
        const existing = await Scheme.findOne({ where: { title } });
        if (existing) throw new Error("Scheme title already exists");
        return true;
      }),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 10, max: 500 })
      .withMessage("Description must be between 10 and 500 characters"),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage("Category must be between 3 and 50 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Category must contain only letters and spaces"),

    body("eligibility")
      .trim()
      .notEmpty()
      .withMessage("Eligibility is required")
      .isLength({ min: 5 })
      .withMessage("Eligibility must be at least 5 characters long"),

    body("community")
      .notEmpty()
      .withMessage("At least one community is required")
      .custom((value) => isStringArray(value))
      .withMessage("Community must be an array of valid strings"),

    body("documents")
      .notEmpty()
      .withMessage("At least one document is required")
      .custom((value) => isStringArray(value))
      .withMessage("Documents must be an array of valid strings"),

    body("state")
      .trim()
      .notEmpty()
      .withMessage("State is required"),

    body("createdBy")
      .optional()
      .isUUID()
      .withMessage("Invalid creator ID"),

    body("updatedBy")
      .optional()
      .isUUID()
      .withMessage("Invalid updater ID"),
  ],

  update: [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters")
      .bail()
      .custom(async (title, { req }) => {
        const existing = await Scheme.findOne({
          where: { title, id: { [Op.ne]: req?.params?.id } },
        });
        if (existing) throw new Error("Scheme title already exists");
        return true;
      }),

    body("description")
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Description must be between 10 and 500 characters"),

    body("category")
      .optional()
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage("Category must be between 3 and 50 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Category must contain only letters and spaces"),

    body("eligibility")
      .optional()
      .trim()
      .isLength({ min: 5 })
      .withMessage("Eligibility must be at least 5 characters long"),

    body("community")
      .optional()
      .custom((value) => isStringArray(value))
      .withMessage("Community must be an array of valid strings"),

    body("documents")
      .optional()
      .custom((value) => isStringArray(value))
      .withMessage("Documents must be an array of valid strings"),

    body("state")
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("State must be between 3 and 100 characters"),

    body("updatedBy")
      .optional()
      .isUUID()
      .withMessage("Invalid updater ID"),
  ],
};

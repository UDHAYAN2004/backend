import { Response } from "express";
import { Scheme } from "../../models/schemes";
import { AuthRequest } from "../middlewares/verifyToken";

// ---------------- Create Scheme ----------------
export const createScheme = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, eligibility, community, documents, state } = req.body;

    // You can verify if the logged-in user is admin
    // if (req.user?.role !== "admin") {
    //   return res.status(403).json({ success: false, message: "Access denied" });
    // }

    const newScheme = await Scheme.create({
      title,
      description,
      category,
      eligibility,
      community,
      documents,
      state,
    });

    return res.status(201).json({
      success: true,
      message: "Scheme created successfully",
      data: newScheme,
    });
  } catch (error: any) {
    console.error("Error creating scheme:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create scheme",
      error: error.message,
    });
  }
};

// ---------------- Update Scheme ----------------
export const updateScheme = async (req: AuthRequest, res: Response) => {
  try {
    const schemeId = req.params.id;
    const scheme = await Scheme.findByPk(schemeId);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    const fieldsToUpdate: any = {};
    ["title", "description", "category", "eligibility", "community", "documents", "state"].forEach((field) => {
      if (req.body[field] !== undefined) fieldsToUpdate[field] = req.body[field];
    });

    await scheme.update(fieldsToUpdate);

    return res.status(200).json({
      success: true,
      message: "Scheme updated successfully",
      data: scheme,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update scheme",
      error: error.message,
    });
  }
};

// ---------------- Delete Scheme ----------------
export const deleteScheme = async (req: AuthRequest, res: Response) => {
  try {
    const schemeId = req.params.id;

    if (!schemeId || typeof schemeId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid scheme ID format",
      });
    }

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    await scheme.destroy();

    return res.status(200).json({
      success: true,
      message: "Scheme deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete scheme",
      error: error.message,
    });
  }
};

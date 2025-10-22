import { Response } from "express";
import { Scheme } from "../../models/schemes";
import { AuthRequest } from "../middlewares/verifyToken";
import { Sequelize } from "sequelize";

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

export const getSchemeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Find the scheme by ID
    const scheme = await Scheme.findByPk(id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error: any) {
    console.error("Error fetching scheme by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch scheme",
      error: error.message,
    });
  }
};

// get all schemes
export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const schemes = await Scheme.findAll();

    if (schemes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No schemes found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Schemes fetched successfully",
      data: schemes,
    });
  } catch (error: any) {
    console.error("Error fetching schemes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch schemes",
      error: error.message,
    });
  }
};

//fetching by category

export const getByCategory = async (req: AuthRequest, res: Response) => {
  try {
    // Cast req.params for TypeScript
    const { category } = req.params as { category: string };

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Fetch schemes from database where category matches
    const schemes = await Scheme.findAll({
      where: { category },
    });

    return res.status(200).json({
      success: true,
      data: schemes,
    });
  } catch (error: any) {
    console.error("Error fetching schemes by category:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getCategoryCount =async(req:AuthRequest, res:Response)=>{
  try{
    const categoryCounts=await Scheme.findAll({
      attributes:['category',
      [Sequelize.fn('COUNT',Sequelize.col("category")),"count"]],
      group:['category'],
      raw:true
    })
    if(categoryCounts.length===0)
    {
      return res.status(200).json({
        success:false,
        message:"No schemes found",
        data:categoryCounts
      })
    }
    return res.status(200).json({
      success:true,
      data:categoryCounts,
    })
  }
  catch(error:any){
    return res.status(500).json({
      success:false,
      message:"Cannot fetch the data",
      error:error.message 
    })
  }
}

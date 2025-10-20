import { Request, Response } from "express";
import { Scheme } from "../../models/schemes";

export const createScheme = async (req: Request, res: Response) => {
  try {
    const { title, description, category, eligibility,community,documents, state } = req.body;
   

    // adding a schemes
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

export const updateScheme = async (req:Request, res:Response)=>{
  try {
    const schemeId=req.params.id
    const scheme=await Scheme.findByPk(schemeId)
    if(!scheme){
      return res.status(404).json({
        success:false,
        message:"Scheme Not Found"
      })
    }
    const fieldsToUpdate : any={};
    ["title","description","category","eligibility","community","documents","state"]
    .forEach((field)=>{
      if(req.body[field] !==undefined)
      {
        fieldsToUpdate[field]=req.body[field]
      }
    }) 
   await scheme.update(fieldsToUpdate)
    return res.status(200).json({
      success:true,
      message:"Scheme Updated Successfully"
    })
    
    
  } catch (error:any) {
    return res.status(500).json({
      success:false,
      message:"Failed to Update Scheme",
      error:error
    })
  }
}

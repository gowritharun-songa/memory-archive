
import Memory from "../models/Memory.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllMemos = async (req, res) => {
   try {
       const memos = await Memory.find();
       res.status(200).json(memos);
   } catch (error) {
       console.error("Error in getAllMemos", error);
       res.status(500).json({
           message: "Internal server error"
       })
   }
};

export const postMemo = async (req, res) => {
  try {
    const {title, content, creator} = req.body;
    
    if(!title || !content || !creator){
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    
    let image = '';
    if(req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Memories",
            resource_type: 'image',
            timeout: 120000
          },
          (error, result) => {
            if(error) return reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      image = result.secure_url;
    }
    
    const newMemo = await Memory.create({
      title,
      content,
      creator,
      image: image || undefined
    });
    const savedMemo = await newMemo.save();
    res.status(201).json({
      sucess: true,
      message: "Memory Saved successfully",
      savedMemo
    });
  } catch (error) {
  console.error("Error in postMemo", error);
  
  if (error.name === "ValidationError") {
     return res.status(400).json({
       message: Object.values(error.errors)[0].message
     });
   }
  
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateMemo = async (req, res) => {
  const { id } = req.params;
  const { title, content, creator } = req.body;
  
  try {
    let updateData = { title, content, creator };
    
    if(req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Memories",
            resource_type: 'image',
            timeout: 120000
          },
          (error, result) => {
            if(error) return reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updateData.image = result.secure_url;
    }
    
    const updatedMemory = await Memory.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedMemory) {
      return res.status(404).json({ message: "Memory not found" });
    }
    
    res.status(200).json(updatedMemory);
  } catch (error) {
    console.error("Error in updateMemo", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMemo = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMemory = await Memory.findByIdAndDelete(id);
        if (!deletedMemory) {
            return res.status(404).json({ message: "Memory not found" });
        }
        res.status(200).json({ message: "Memory deleted successfully", deletedMemory });
    } catch (error) {
        console.error("Error in deleteMemo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const memory = await Memory.findById(id);
        if(!memory) {
            return res.status(404).json({ message: "Memory not found" });
        }
        res.status(200).json({
            message: "Fetched the Memory",
            memory});
    } catch(error) {
        console.error("Error in getById", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
};
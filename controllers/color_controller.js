const Color = require('../models/colorModel');
const asyncHandler = require('express-async-handler');

// create Color
const createColor = asyncHandler(async(req,res)=>{
   try{
     const newColor = await Color.create(req.body);
     res.json(newColor);
   }catch(error){
    throw new Error(error);
   }
});


// update Color
const updateColor = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const updatedColor = await Color.findByIdAndUpdate(id,req.body,
        {
          new:true,
        }
      );
      res.json(updatedColor);
    }catch(error){
     throw new Error(error);
    }
 });


 // get Color
 const getColor = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const getColor = await Color.findById(id);
      res.json(getColor);
    }catch(error){
     throw new Error(error);
    }
 });


// get all Color
 const getAllColor = asyncHandler(async(req,res)=>{
    try{
      const getallColor = await Color.find();
      res.json(getallColor);
    }catch(error){
     throw new Error(error);
    }
 });


 // delete Color
 const deleteColor = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const deleteColor = await Color.findByIdAndDelete(id);
      res.json(deleteColor);
    }catch(error){
     throw new Error(error);
    }
 });

module.exports = {createColor,updateColor,getColor,getAllColor,deleteColor};
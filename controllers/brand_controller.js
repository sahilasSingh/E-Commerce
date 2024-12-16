const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');

// create brand
const createBrand = asyncHandler(async(req,res)=>{
   try{
     const newBrand = await Brand.create(req.body);
     res.json(newBrand);
   }catch(error){
    throw new Error(error);
   }
});


// update brand
const updateBrand = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const updatedBrand = await Brand.findByIdAndUpdate(id,req.body,
        {
          new:true,
        }
      );
      res.json(updatedBrand);
    }catch(error){
     throw new Error(error);
    }
 });


 // get brand
 const getBrand = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const getBrand = await Brand.findById(id);
      res.json(getBrand);
    }catch(error){
     throw new Error(error);
    }
 });


// get all brand
 const getAllBrand = asyncHandler(async(req,res)=>{
    try{
      const getallBrand = await Brand.find();
      res.json(getallBrand);
    }catch(error){
     throw new Error(error);
    }
 });


 // delete brand
 const deleteBrand = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const deleteBrand = await Brand.findByIdAndDelete(id);
      res.json(deleteBrand);
    }catch(error){
     throw new Error(error);
    }
 });

module.exports = {createBrand,updateBrand,getBrand,getAllBrand,deleteBrand};
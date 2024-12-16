const Pcategory = require('../models/prodCategoryModel');
const asyncHandler = require('express-async-handler');

// create prod category
const createProdCategory = asyncHandler(async(req,res)=>{
   try{
     const newProdCategory = await Pcategory.create(req.body);
     res.json(newProdCategory);
   }catch(error){
    throw new Error(error);
   }
});


// update prod category
const updateProdCategory = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const updatedProdCategory = await Pcategory.findByIdAndUpdate(id,req.body,
        {
          new:true,
        }
      );
      res.json(updatedProdCategory);
    }catch(error){
     throw new Error(error);
    }
 });


 // get prod category
 const getProdCategory = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const getProdCategory = await Pcategory.findById(id);
      res.json(getProdCategory);
    }catch(error){
     throw new Error(error);
    }
 });


// get all prod category
 const getAllProdCategory = asyncHandler(async(req,res)=>{
    try{
      const getallProdCategory = await Pcategory.find();
      res.json(getallProdCategory);
    }catch(error){
     throw new Error(error);
    }
 });


 // delete prod category
 const deleteProdCategory = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const deleteProdCategory = await Pcategory.findByIdAndDelete(id);
      res.json(deleteProdCategory);
    }catch(error){
     throw new Error(error);
    }
 });

module.exports = {createProdCategory,updateProdCategory,getProdCategory,getAllProdCategory,deleteProdCategory};
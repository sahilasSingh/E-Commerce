const Blogcategory = require('../models/blogCategoryModel');
const asyncHandler = require('express-async-handler');

// create blog category
const createBlogCategory = asyncHandler(async(req,res)=>{
   try{
     const newBlogCategory = await Blogcategory.create(req.body);
     res.json(newBlogCategory);
   }catch(error){
    throw new Error(error);
   }
});


// update blog category
const updateBlogCategory = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const updatedBlogCategory = await Blogcategory.findByIdAndUpdate(id,req.body,
        {
          new:true,
        }
      );
      res.json(updatedBlogCategory);
    }catch(error){
     throw new Error(error);
    }
 });


 // get blog category
 const getBlogCategory = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const getBlogCategory = await Blogcategory.findById(id);
      res.json(getBlogCategory);
    }catch(error){
     throw new Error(error);
    }
 });


// get all blog category
 const getAllBlogCategory = asyncHandler(async(req,res)=>{
    try{
      const getallBlogCategory = await Blogcategory.find();
      res.json(getallBlogCategory);
    }catch(error){
     throw new Error(error);
    }
 });


 // delete blog category
 const deleteBlogCategory = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const deleteBlogCategory = await Blogcategory.findByIdAndDelete(id);
      res.json(deleteBlogCategory);
    }catch(error){
     throw new Error(error);
    }
 });

module.exports = {createBlogCategory,updateBlogCategory,getBlogCategory,getAllBlogCategory,deleteBlogCategory};
const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');

// create Coupon
const createCoupon = asyncHandler(async(req,res)=>{
   try{
     const newCoupon = await Coupon.create(req.body);
     res.json(newCoupon);
   }catch(error){
    throw new Error(error);
   }
});


// update Coupon
const updateCoupon = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const updatedCoupon = await Coupon.findByIdAndUpdate(id,req.body,
        {
          new:true,
        }
      );
      res.json(updatedCoupon);
    }catch(error){
     throw new Error(error);
    }
 });


// get all Coupon
const getAllCoupon = asyncHandler(async(req,res)=>{
    try{
      const getallCoupon = await Coupon.find();
      res.json(getallCoupon);
    }catch(error){
     throw new Error(error);
    }
 });


 // delete Coupon
 const getCoupon = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const getaCoupon = await Coupon.findById(id);
      res.json(getaCoupon);
    }catch(error){
     throw new Error(error);
    }
 });


 // delete Coupon
 const deleteCoupon = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    try{
      const deleteCoupon = await Coupon.findByIdAndDelete(id);
      res.json(deleteCoupon);
    }catch(error){
     throw new Error(error);
    }
 });

module.exports = {createCoupon, updateCoupon,getCoupon,getAllCoupon,deleteCoupon};
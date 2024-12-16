const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');
const {generateRefreshToken} = require('../config/refreshtoken')
const jwt = require('jsonwebtoken');
const sendEmail = require('./email_controller');
const crypto = require('crypto');
const uniqid = require('uniqid');

//create user
const createUser = asyncHandler(async(req,res) =>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser){
     const newUser = await User.create(req.body);
     res.json(newUser);
    }else{
      throw new Error('User Already Exists');
    }
});

// user login
const loginUser = asyncHandler(async(req,res) =>{
    const {email,password} = req.body;
    //check if user exists or not
    const findUser = await User.findOne({email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser?._id,
            {
              refreshToken:refreshToken,
            },
            {
                new: true
            }
        );
        res.cookie('refreshToken',refreshToken,{
           httpOnly: true,
           maxAge: 24 * 60 * 60 * 1000,
        });
     res.json({
       _id: findUser?._id,
       firstname:findUser?.firstname,
       lastname:findUser?.lastname,
       email:findUser?.email,
       mobile:findUser?.mobile ,
       token:generateToken(findUser?._id),
     })
    }else{
        throw new Error("Invalid Credentials")
    }
});

// user login Admin
const loginAdmin = asyncHandler(async(req,res) =>{
    const {email,password} = req.body;
    //check if user exists or not
    const findAdmin = await User.findOne({email});
    if(findAdmin.role !== 'admin')throw new Error("Not Authorized");
    if(findAdmin && (await findAdmin.isPasswordMatched(password))){
        const refreshToken = generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(findAdmin?._id,
            {
              refreshToken:refreshToken,
            },
            {
                new: true
            }
        );
        res.cookie('refreshToken',refreshToken,{
           httpOnly: true,
           maxAge: 24 * 60 * 60 * 1000,
        });
     res.json({
       _id: findAdmin?._id,
       firstname:findAdmin?.firstname,
       lastname:findAdmin?.lastname,
       email:findAdmin?.email,
       mobile:findAdmin?.mobile ,
       token:generateToken(findAdmin?._id),
     })
    }else{
        throw new Error("Invalid Credentials")
    }
});

// handle refreshtoken
const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        throw new Error("No Refresh Token present in db or not matched");
    }
    jwt.verify( refreshToken, process.env.JWT_SECRET, (err,decoded)=>{
        if(err || user.id !== decoded.id){
         throw new Error("This is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    });
    
});


// logout
const logoutUser = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie.refreshToken)throw new Error("No Refresh Token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly:true,
        secure:true,
    });
    return res.sendStatus(204);
});

// update user
const updateaUser = asyncHandler(async(req,res)=>{
  const  { _id } = req.user;
  //validateMongodbId(_id);
  try{
    const updateUser = await User.findByIdAndUpdate(
        _id,
        {
         firstname:req?.body?.firstname,
         lastname:req?.body?.lastname,
         email:req?.body?.email,
         mobile:req?.body?.mobile,
       },
       {
        new:true,
       } 
    );
    res.json(updateUser);
  }catch(error){
    throw new Error(error);
  }
});

// save address
const saveAddress = asyncHandler(async(req,res,next)=>{
    const  { _id } = req.user;
    //validateMongodbId(_id);
    try{
      const updateUser = await User.findByIdAndUpdate(
          _id,
        {
           address:req?.body?.address,
        },
        {
          new:true,
        } 
      );
      res.json(updateUser);
    }catch(error){
      throw new Error(error);
    }
});


// get all users
const getAllUser = asyncHandler(async(req,res)=>{
  try{
      const getUsers = await User.find();
      res.json(getUsers);
    }catch(error){
      throw new Error(error);
    } 
});

//get user
const getaUser = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    //validateMongodbId(id);
    try{
        const getUser = await User.findById(id);
        res.json(getUser);
    }catch(error){
      throw new Error(error);
    } 
});

//delete user
const deleteaUser = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    //validateMongodbId(id);
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser);
    }catch(error){
      throw new Error(error);
    } 
});

// update password
const updatePassword = asyncHandler(async(req,res)=>{
    const { _id } = req.user;
    const { password } = req.body;
    //validateMongodbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }
    else{
        res.json(user);
    }
});


// forgot password token
const forgotPasswordToken = asyncHandler(async(req,res)=>{
   const { email } = req.body;
   const user = await User.findOne({email});
   if(!user)throw new Error("User not found with this email");
   try{
     const token  = await user.createPassowrdResetToken();
     await user.save();
     const resetURL = `Hi, please follow this link to reset your password. This link is valid till 10 minutes from now. <a href ='http://localhost:4000/api/user/reset-password/${token}'>Click Here</>`;
     const data = {
        to: email,
        text: "Hey user",
        subject: "Forgot Password Link",
        htm:  resetURL,
     }
     sendEmail(data);
     res.json(token);
   }
   catch(error){
    throw new Error(error);
   }
});

// reset password
const resetPassword = asyncHandler(async(req,res)=>{
   const {password} = req.body;
   const {token} = req.params;
   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
   const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
   });
   if(!user)throw new Error("Token Expired, Please try again later");
   user.password = password;
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;
   await user.save();
   res.json(user);
});


// get wishlist
const getWishlist = asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  console.log(req.user);
  try{
   const findAdmin = await User.findById(_id).populate("wishlist");
   res.json(findAdmin);
  }
  catch(error){
    throw new Error(error);
  }
});

// user cart
const userCart = asyncHandler(async(req,res)=>{
    const { cart } = req.body;
    const { _id } = req.user;
   try{
     let products = [];
     const user = await User.findById(_id);
     const alreadyExistCart = await Cart.findOne({ orderby: user._id });
     if(alreadyExistCart){
        alreadyExistCart.remove();
     }
     for(let i=0; i < cart.length; i++){
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let getPrice = await Product.findById(cart[i]._id).select("price").exec();
        object.price = getPrice.price;
        products.push(object);
     }
     let cartTotal = 0;
     for(let i = 0; i < products.length; i++){
        cartTotal = cartTotal + products[i].price * products[i].count;
     }
     let newCart = await new Cart({
        products,
        cartTotal,
        orderby: user?._id,
     }).save();
     res.json(newCart);
    }
    catch(error){
     throw new Error(error);
   }
});


// get user cart
const getUserCart = asyncHandler(async(req,res)=>{
    const { _id } = req.user;
  try{
     const cart = await Cart.findOne({ orderby:_id }).populate("products.product");
     res.json(cart);
    }
    catch(error){
        throw new Error(error);
    }
});


// get empty cart
const emptyCart = asyncHandler(async(req,res)=>{
    const { _id } = req.user;
  try{
     const user = await User.findOne({ _id });
     const cart = await Cart.findOneAndDelete({ orderby: user._id });
     res.json(cart);
    }
    catch(error){
        throw new Error(error);
    }
});


// apply coupon
const applyCoupon = asyncHandler(async(req,res)=>{
   const { coupon } = req.body;
   const { _id } = req.user;

   const validCoupon = await Coupon.findOne({ name: coupon });
   if(validCoupon === null){
    throw new Error("Invalid Coupon");
   }
   const user = await User.findOne({ _id });
   let {products,cartTotal} = await Cart.findOne({ orderby:_id }).populate("products.product");
   let totalAfterDiscount = (
    cartTotal - (cartTotal * validCoupon.discount) / 100
   ).toFixed(2);
   await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new:true }
   );
   res.json(totalAfterDiscount);
});


// create order
const createOrder = asyncHandler(async (req,res)=>{
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  try{
     if(!COD) throw new Error("Create cash order failed");
     const user = await User.findById(_id);
     let userCart = await Cart.findOne({ orderby: user._id });
     let finalAmount = 0;
     if(couponApplied && userCart.totalAfterDiscount){
     finalAmount = userCart.totalAfterDiscount * 100;
    }else{
     finalAmount = userCart.cartTotal * 100;
   }
   let newOrder = await new Order({
     products: userCart.products,
     paymentIntent:{
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
    },
    orderby: user._id,
    orderStatus: "Cash on Delivery",
   }).save();
   let update = userCart.products.map((item)=>{
    return {
        updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
    };
   });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  }catch(error){
    throw new Error(error);
  }
});


// get order
const getOrders = asyncHandler(async(req,res)=>{
    const { _id } = req.user;
  try{
     const userorder = await Order.findOne({ orderby:_id }).populate("products.product");
     res.json(userorder);
    }
    catch(error){
        throw new Error(error);
    }
});


// update order
const updateOrderStatus = asyncHandler(async(req,res)=>{
    const { status } = req.body;
    const { id } = req.params;
  try{
    const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: status,
          paymentIntent:{
          status: status,
          },
        },
        { new:true }
    );
    res.json(updateOrderStatus);
    }
    catch(error){
        throw new Error(error);
    }
});


module.exports = {createUser,loginUser,loginAdmin,getAllUser,getaUser,deleteaUser,updateaUser,handleRefreshToken,logoutUser,updatePassword,forgotPasswordToken,resetPassword,getWishlist,saveAddress,userCart,getUserCart,emptyCart,applyCoupon,createOrder,getOrders,updateOrderStatus};
const express = require('express');
const {
    createUser,
    loginUser,
    loginAdmin,
    getAllUser,
    getaUser,
    deleteaUser,
    updateaUser,
    handleRefreshToken,
    logoutUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus} = require('../controllers/user_controller');
const router = express.Router();
const {authMiddleware,isAdmin} = require("../middlewares/authMiddleware");


router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/admin-login',loginAdmin);
router.post('/cart',authMiddleware,userCart);
router.post('/cart/apply-coupon',authMiddleware,applyCoupon);
router.post('/cart/cash-order',authMiddleware,createOrder);
router.put('/password',authMiddleware,updatePassword);
router.post('/forgot-password-token',forgotPasswordToken);
router.put('/reset-password/:token',resetPassword);
router.put('/order/update-order/:id',authMiddleware,isAdmin,updateOrderStatus);
router.get('/all-users',getAllUser);
router.get('/get-orders',authMiddleware,getOrders);

router.get('/refresh',handleRefreshToken);
router.get('/logout',logoutUser);
router.get('/wishlist',authMiddleware,getWishlist);
router.get('/cart',authMiddleware,getUserCart);

router.get('/:id',getaUser);
router.delete('/empty-cart',authMiddleware,emptyCart);
router.delete('/:id',deleteaUser);
router.put('/edit-user',authMiddleware,updateaUser);
router.put('/save-address',authMiddleware,saveAddress);



module.exports = router;
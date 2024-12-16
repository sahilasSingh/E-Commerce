const express = require('express');
const { createCoupon,updateCoupon,getCoupon,getAllCoupon,deleteCoupon} = require('../controllers/coupon_controller');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createCoupon);
router.put('/:id',authMiddleware,isAdmin,updateCoupon);

router.get('/:id',getCoupon);
router.get('/',getAllCoupon);
router.delete('/:id',authMiddleware,isAdmin,deleteCoupon);

module.exports = router;
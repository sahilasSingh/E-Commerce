const express = require('express');
const { createBrand, updateBrand,getBrand, getAllBrand, deleteBrand} = require('../controllers/Brand_controller');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createBrand);
router.put('/:id',authMiddleware,isAdmin,updateBrand);

router.get('/:id',getBrand);
router.get('/',getAllBrand);
router.delete('/:id',authMiddleware,isAdmin,deleteBrand);


module.exports = router;
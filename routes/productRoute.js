const express = require('express');
const {createProduct, getAllProduct, getaProduct,deleteProduct, updatedProduct, addToWishlist,rating, uploadImages, deleteImages} = require('../controllers/product_controller');
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware');
const {uploadPhoto,productImgResize} = require('../middlewares/uploadImages');
const router = express.Router();

router.post('/create-product',authMiddleware,isAdmin,createProduct);
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array("images", 10),productImgResize,uploadImages);
router.get('/:id',getaProduct);
router.put('/wishlist',authMiddleware,addToWishlist);
router.put('/rating',authMiddleware,rating);

router.put('/:id',authMiddleware,isAdmin,updatedProduct);
router.delete('/:id',authMiddleware,isAdmin,deleteProduct);
router.delete('/delete-img/:id',authMiddleware,isAdmin,deleteImages);
router.get('/',getAllProduct);




module.exports = router;
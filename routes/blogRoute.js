const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, liketheBlog,disliketheBlog,uploadImage} = require('../controllers/blog_controller');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto,blogImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createBlog);
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array("images", 2),blogImgResize,uploadImage);
router.put('/likes',authMiddleware,liketheBlog);
router.put('/dislikes',authMiddleware,disliketheBlog);
router.put('/:id',authMiddleware,isAdmin,updateBlog);

router.get('/:id',getBlog);
router.get('/',getAllBlog);
router.delete('/:id',authMiddleware,isAdmin,deleteBlog);



module.exports = router;
const express = require('express');
const { createBlogCategory, updateBlogCategory,getBlogCategory, getAllBlogCategory, deleteBlogCategory} = require('../controllers/blog_category_controller');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createBlogCategory);
router.put('/:id',authMiddleware,isAdmin,updateBlogCategory);

router.get('/:id',getBlogCategory);
router.get('/',getAllBlogCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteBlogCategory);


module.exports = router;
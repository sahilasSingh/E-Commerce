const express = require('express');
const { createColor, updateColor,getColor, getAllColor, deleteColor} = require('../controllers/color_controller');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createColor);
router.put('/:id',authMiddleware,isAdmin,updateColor);

router.get('/all-colors',getAllColor);
router.get('/:id',getColor);
router.delete('/:id',authMiddleware,isAdmin,deleteColor);


module.exports = router;
const express = require('express');
const { createProdCategory,updateProdCategory,getProdCategory,getAllProdCategory,deleteProdCategory} = require('../controllers/prod_category_controller');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createProdCategory);
router.put('/:id',authMiddleware,isAdmin,updateProdCategory);

router.get('/:id',getProdCategory);
router.get('/',getAllProdCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteProdCategory);


module.exports = router;
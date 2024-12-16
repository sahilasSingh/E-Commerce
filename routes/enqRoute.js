const express = require('express');
const { createEnquiry, updateEnquiry,getEnquiry, getAllEnquiry, deleteEnquiry} = require('../controllers/enq_controller');
const router = express.Router();

router.post('/',createEnquiry);
router.put('/:id',updateEnquiry);

router.get('/all-Enquiries',getAllEnquiry);
router.get('/:id',getEnquiry);
router.delete('/:id',deleteEnquiry);


module.exports = router;
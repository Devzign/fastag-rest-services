const express = require('express');
const router = express.Router();
const fastagAllocationController = require('../controllers/fastagAllocation.Controller'); // Adjust path as necessary
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')


router.post('/upload', verifyAdmin, fastagAllocationController.uploadCsv, fastagAllocationController.allocateFastags);
router.get('/:SrnNo', verifyAdmin, fastagAllocationController.checkIsFastagIsAssigned);
module.exports = router;

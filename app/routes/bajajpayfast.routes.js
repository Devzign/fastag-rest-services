const express = require('express');
const router = express.Router();
// const signupController = require('../auth/authController');
const bajajpayController = require('../controllers/bajajpay.controller');
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')


router.post('/validatecutomer',verifyUser, bajajpayController.validateCustReqAndSendOTP);
router.post('/verifyotp',verifyUser, bajajpayController.verifyOtp);
router.post('/createCustomer',verifyUser, bajajpayController.createCustomer);
router.post('/vehicleMakerList',verifyUser, bajajpayController.vehicleMakerList);
router.post('/vehicleModelList',verifyUser, bajajpayController.vehicleModelList);
router.post('/registerFastag',verifyUser, bajajpayController.registerFastag);
router.post('/replaceFastag',verifyUser, bajajpayController.replaceFastag);
router.post('/uploadDocument',verifyUser, bajajpayController.uploadDocument);
module.exports = router;

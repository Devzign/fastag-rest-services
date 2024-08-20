const express = require('express');
const router = express.Router();
// const signupController = require('../auth/authController');
const authController = require('../auth/authController');
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')

router.post('/login',authController.sendotp);
router.post('/verify',authController.verify);
module.exports = router;

/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')

// router.post('/user/otp', userController.sendOtpToUser);
// router.post('/create/:id',userController.createUser);
router.post('/login',userController.login);
router.post('/signup',userController.signUp);
router.get('/', userController.getAllUsers);
router.get('/:userId',verifyUser,userController.getUserByUserId);
router.put('/:id',verifyUser, userController.updateUserById);
router.post('/create/:id',verifyUser, userController.getUserByUserId);
router.get('/get/all', userController.getAllUsersWithNoPagination);

module.exports = router; 
 
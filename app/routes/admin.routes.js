const express = require('express');
const router = express.Router();
const authController = require("../../app/auth/admin.controller");
const adminController = require('../../app/auth/admin.controller');
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')

router.post('/create',authController.createAdmin);
router.post('/login',authController.adminLogin);
// router.post('/superAdminlogin',authController.superAdminLogin);
router.get('/getallroles', verifyAdmin, adminController.getallrole);
router.get('/getrolesbyid/:id', verifyAdmin, adminController.getroleById);
router.put('/updaterole/:id', verifyAdmin, adminController.updaterole);
router.delete('/deletrole/:id',verifyAdmin, adminController.deleterole);
router.put('/updateuser/:id', verifyAdmin, adminController.updateUserByUserId);
router.put('/updateuserpassword/:id',verifyAdmin, adminController.updateUserPasswordByUserId);
router.put('/updatetlpassword/:id',verifyAdmin, adminController.updateTLPasswordByTLId);
router.put('/updatepassword/:id',verifyAdmin, adminController.updateAdminPasswordByAdminId);
router.delete('/deleteuser/:id',verifyAdmin,  adminController.deleteUserByUserId);
router.get('/gettotalcount', verifyAdmin, adminController.getSumOfUserAgentTlProject);
router.post('/agent/wallet/:agentId',verifyAdmin, adminController.addPointToAgentWalletByAgentId);
router.put('/agent/wallet/:agentId',verifyAdmin, adminController.updatePointToAgentWalletByAgentId);
router.patch('/agent/wallet/:agentId',verifyAdmin, adminController.setPointToAgentWalletByAgentId);
router.get('/wallets', adminController.getAllWallets);
router.post('/plan', verifyAdmin, adminController.createPlan);
router.put('/plan/:id', verifyAdmin, adminController.updatePlan);
router.get('/plan', verifyAdmin, adminController.getPlans);
router.get('/fastags', adminController.getActivateFastags);
router.delete('/fastags/:fastagId', verifyAdmin, adminController.deleteFastagsByFastagId);
router.put('/update', verifyAdmin, adminController.updateAllFastagDateTime);

module.exports = router;
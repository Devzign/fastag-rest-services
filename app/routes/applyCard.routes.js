const express = require('express');
const router = express.Router();
// const signupController = require('../auth/authController');
const applyCardController = require('../controllers/applyCard.controller');
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')

router.post('/', applyCardController.createApplyCard);
router.get('/:adminId', verifyAdmin, applyCardController.getApplyCard);
router.get('/byAgentId/:agentId', verifyUser, applyCardController.getApplyCardByAgentId);
router.put('/:applyCardId', verifyUser, applyCardController.updateApplyCardStatus)
module.exports = router;


const express = require('express');
const router = express.Router();
const tLController = require('../controllers/teamLead.Controller');
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')

router.post('/:adminId',verifyAdmin, tLController.createTeamLead);
router.post('/auth/login', tLController.teamLeadLogin);
router.get('/', tLController.getAllTeamLeads);
router.get('/list', tLController.getAllTeamLeadsNameOnly);
router.get('/:id', tLController.getTeamLeadById);
router.put('/:id', tLController.updateTeamLeadById);
router.put('/updateusertype/:userId', tLController.updateUserTypeByUserId);
router.get('/agent/fastags/:tlId/:agentId', tLController.getAgentFastagsByTlIdAndAgentId);
router.get('/agent/fastags/:tlId', tLController.getAgentsFastagsByTlId);
router.get('/totalcount/:tlId', tLController.getTotalCountByTlId)
module.exports = router;

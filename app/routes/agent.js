const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.Controller');
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')

router.post('/create/:tlId', agentController.createAgent);
router.get('/', verifyAdmin, agentController.getAllAgents);
router.get('/all', verifyAdmin, agentController.getAllAgentsNoPagination);
router.get('/teamlead/:tlId', agentController.getAgentsByTLId);
router.get('/teamleadlist/:tlId', verifyAdmin, agentController.getAgentsByTLIdNoPagination);
router.get('/:id', verifyUser, agentController.getAgentById);
router.put('/update/:adminId/:id', verifyAdmin, agentController.updateAgentByAdminId);
router.delete('/delete/:tlId/:agentId', verifyAdmin, agentController.deleteAgentByTLId);
router.put('/makeAgent/:tlId/:userId', agentController.makeUserAgentByTLId);
// router.put('/updateUser/:id',agentController.updateUserById);
router.post('/fastag/activate/:id', verifyUser, agentController.activateFastagByAgentId);
router.get('/fastag/activate/:id', agentController.getActivatedFastags);
router.get('/totalcount/:id', verifyUser, agentController.getTotalCountbyAgentId);
router.get('/totalearninglist/:id', verifyUser, agentController.getEarningListbyAgentId);
router.get('/transactions/:id', verifyUser, agentController.getTransactionsbyAgentId);
router.post('/fastag/wallet/:id',verifyUser,agentController.updateAssignTagAndCutWallet)

module.exports = router;
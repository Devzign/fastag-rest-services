const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.Controller');
const verifyAdmin = require('../middlewares/verifyAdminToken');
const verifyUser = require('../middlewares/verifyUserToken')


router.post('/add/:adminId', verifyAdmin , projectController.addProject);
router.get('/get/:id',projectController.getProjectById);
router.get('/getall',projectController.getAllProjects);
router.put('/update/:adminId/:projectId',projectController.updateProject)
router.delete('/delete/:id',projectController.deleteProject);

module.exports = router;

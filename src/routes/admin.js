const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const verifyToken = require('../app/middlewares/authMiddleware')
const verifyAdmin = require('../app/middlewares/adminMiddleware')
/* 
router.get('/login', authController.showLogin);*/

router.get('/dashboard', verifyAdmin, adminController.showDashboard);
router.get('/manage-users', verifyAdmin, adminController.getUsers)
router.get('/manage-tasks', verifyAdmin, adminController.getTasks)
router.put('/task/:id/edit', verifyAdmin, adminController.editTask)
router.get('/task/:id/edit', verifyAdmin, adminController.showEditTask)
router.post('/task/:id/delete', verifyAdmin, adminController.deleteTask)
router.post('/user/:id/delete', verifyAdmin, adminController.deleteUser)
router.get('/task/create', verifyAdmin, adminController.showCreateTaskPage)
router.post('/task/create', verifyAdmin, adminController.createTask)

router.get('/logout', verifyAdmin, adminController.logout);

/* router.get('/home', verifyToken, adminController.toHome); */
/* 
router.get('/change-profile', verifyToken, userController.toChangeProfile);
router.post('/change-profile', verifyToken, userController.updateProfile); */
/* 
router.get('/logout', verifyToken, userController.logout); */

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const verifyToken = require('../app/middlewares/authMiddleware')

router.get('/register', userController.showRegisterPage);
router.post('/register', userController.register);
router.get('/login', userController.showLoginPage);
router.post('/login', userController.login);
router.get('/home', verifyToken, userController.showHomePage);

router.get('/profile', verifyToken, userController.getProfile)
router.get('/change-profile', verifyToken, userController.toChangeProfile);
router.post('/change-profile', verifyToken, userController.updateProfile);

router.get('/logout', verifyToken, userController.logout);

module.exports = router;

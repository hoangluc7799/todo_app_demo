const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const verifyToken = require('../app/middlewares/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý tài khoản người dùng
 */

router.get('/register', userController.showRegisterPage);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *                 example: hoangluc
 *               password:
 *                 type: string
 *                 example: 123456
 *               confirmPassword:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc username đã tồn tại
 *       500:
 *         description: Lỗi server
 */

router.post('/register', userController.register);
router.get('/login', userController.showLoginPage);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: hoangluc
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, cấp JWT Token
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Sai tên đăng nhập hoặc mật khẩu
 *       403:
 *         description: Tài khoản đã bị khóa
 *       500:
 *         description: Lỗi server
 */
router.post('/login', userController.login);
router.get('/home', verifyToken, userController.showHomePage);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Lấy thông tin cá nhân
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lấy thông tin cá nhân thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin cá nhân thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                       example: user_21
 *                     role:
 *                       type: string
 *                       example: user
 *                     status:
 *                       type: string
 *                       example: unlock
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.get('/profile', verifyToken, userController.getProfile)
router.get('/change-profile', verifyToken, userController.toChangeProfile);

/**
 * @swagger
 * /user/change-profile:
 *   post:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: hoangluc123
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       500:
 *         description: Lỗi cập nhật
 */
router.post('/change-profile', verifyToken, userController.updateProfile);

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Đăng xuất tài khoản
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */
router.get('/logout', verifyToken, userController.logout);

module.exports = router;

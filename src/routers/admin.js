const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const verifyToken = require('../app/middlewares/authMiddleware')
const verifyAdmin = require('../app/middlewares/adminMiddleware')
/* 
router.get('/login', authController.showLogin);*/

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Quản lý người dùng và công việc dành cho Admin
 */

router.get('/dashboard', verifyAdmin, adminController.showDashboard);

/**
 * @swagger
 * /admin/manage-users:
 *   get:
 *     summary: Hiển thị danh sách người dùng
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo username
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang cần xem
 *     responses:
 *       200:
 *         description: Hiển thị danh sách người dùng
 *       500:
 *         description: Lỗi server
 */
router.get('/manage-users', verifyAdmin, adminController.getUsers)

/**
 * @swagger
 * /admin/manage-tasks:
 *   get:
 *     summary: Hiển thị danh sách công việc
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tiêu đề công việc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang cần xem
 *     responses:
 *       200:
 *         description: Hiển thị danh sách công việc
 *       500:
 *         description: Lỗi server
 */

router.get('/manage-tasks', verifyAdmin, adminController.getTasks)


router.get('/task/:id/edit', verifyAdmin, adminController.showEditTask)

/**
 * @swagger
 * /admin/task/{id}/edit:
 *   put:
 *     summary: Cập nhật công việc
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của task cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *                 example: Học Node.js
 *               Description:
 *                 type: string
 *                 example: Học API
 *               Status0:
 *                 type: string
 *                 example: Chưa Hoàn Thành
 *               Duedate:
 *                 type: string
 *                 format: date
 *                 example: '2026-11-01'
 *     responses:
 *       200:
 *         description: Cập nhật công việc thành công
 *       404:
 *         description: Không tìm thấy task
 *       500:
 *         description: Lỗi server
 */
router.put('/task/:id/edit', verifyAdmin, adminController.editTask)

/**
 * @swagger
 * /admin/task/{id}/delete:
 *   post:
 *     summary: Xóa công việc
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của task cần xóa
 *     responses:
 *       200:
 *         description: Xóa công việc thành công
 *       404:
 *         description: Không tìm thấy task
 *       500:
 *         description: Lỗi server
 */
router.post('/task/:id/delete', verifyAdmin, adminController.deleteTask)

/**
 * @swagger
 * /admin/user/{id}/delete:
 *   post:
 *     summary: Xóa người dùng
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user cần xóa
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi server
 */
router.post('/user/:id/delete', verifyAdmin, adminController.deleteUser)

router.get('/task/create', verifyAdmin, adminController.showCreateTaskPage)

/**
 * @swagger
 * /admin/task/create:
 *   post:
 *     summary: Tạo công việc mới
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *             properties:
 *               Title:
 *                 type: string
 *                 example: Học Node.js
 *               Description:
 *                 type: string
 *                 example: Học Express
 *               Status0:
 *                 type: string
 *                 example: Chưa Hoàn Thành
 *               Duedate:
 *                 type: string
 *                 format: date
 *                 example: '2026-11-01'
 *               UserId:
 *                 type: string
 *                 example: '6ae3161204535660bca78b05'
 *     responses:
 *       201:
 *         description: Tạo công việc thành công
 *       500:
 *         description: Lỗi khi tạo công việc
 */
router.post('/task/create', verifyAdmin, adminController.createTask)

/**
 * @swagger
 * /admin/logout:
 *   get:
 *     summary: Đăng xuất Admin
 *     tags: [Admin]
 *     responses:
 *       302:
 *         description: Xóa cookie token và chuyển về trang đăng nhập
 */
router.get('/logout', verifyAdmin, adminController.logout);


router.get('/:id/lock', verifyAdmin, adminController.lockUser )
router.get('/:id/unlock', verifyAdmin, adminController.unlockUser )

module.exports = router;

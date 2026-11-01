
const express = require('express')
const router = express.Router()
const taskController = require('../app/controllers/TaskController');
const verifyToken = require('../app/middlewares/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Quản lý công việc cá nhân 
 */

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Lấy danh sách task (tìm kiếm + phân trang)
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên task
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Số trang hiện tại
 *     responses:
 *       200:
 *         description: Lấy danh sách task thành công
 *       500:
 *         description: Lỗi server
 */
router.get('/',  verifyToken, taskController.getUserTasks);

/**
 * @swagger
 * /task/{id}/edit:
 *   get:
 *     summary: Lấy thông tin task và hiển thị giao diện chỉnh sửa
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của task
 *     responses:
 *       200:
 *         description: Hiển thị giao diện chỉnh sửa thành công
 *       500:
 *         description: Lỗi không lấy được dữ liệu
 */
router.get('/:id/edit', verifyToken, taskController.edit);

/**
 * @swagger
 * /task/{id}/edit:
 *   put:
 *     summary: Cập nhật thông tin task
 *     tags: [Tasks]
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
 *                 example: Học cách viết API
 *               Status0:
 *                 type: string
 *                 example: Chưa Hoàn Thành
 *               Duedate:
 *                 type: string
 *                 format: date
 *                 example: '2026-11-01'
 *     responses:
 *       200:
 *         description: Cập nhật task thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi cập nhật
 */
router.put('/:id/edit', verifyToken, taskController.update);

/**
 * @swagger
 * /task/{id}/delete:
 *   delete:
 *     summary: Xóa task theo ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của task cần xóa
 *     responses:
 *       200:
 *         description: Xóa task thành công
 *       404:
 *         description: Không tìm thấy task
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id/delete', verifyToken, taskController.delete);

router.get('/create', verifyToken, taskController.create);

/**
 * @swagger
 * /task/create:
 *   post:
 *     summary: Tạo task mới
 *     tags: [Tasks]
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
 *                 example: Hoàn thành bài tập backend
 *               Status:
 *                 type: string
 *                 example: Chưa Hoàn Thành
 *               DueDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-11-01'
 *     responses:
 *       201:
 *         description: Tạo task thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/create', verifyToken, taskController.store);

module.exports = router;

const express = require('express')
const router = express.Router()
const taskController = require('../app/controllers/TaskController');
const verifyToken = require('../app/middlewares/authMiddleware')

router.get('/',  verifyToken, taskController.getUserTasks);
router.get('/:id/edit', verifyToken, taskController.edit);
router.put('/:id/edit', verifyToken, taskController.update);

router.delete('/:id/delete', verifyToken, taskController.delete);

router.get('/create', verifyToken, taskController.create);
router.post('/create', verifyToken, taskController.store);
module.exports = router;

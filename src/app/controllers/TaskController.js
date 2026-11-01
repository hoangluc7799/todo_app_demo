const Task = require('../models/Task');
const mongoose = require('mongoose');

class TaskController {

    getUserTasks = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const { search } = req.query;
            let filter = { UserId: req.userId };

            if (search) {
                filter.Title = { $regex: search, $options: 'i' };
            }

            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const totalTasks = await Task.countDocuments(filter);
            const totalPages = Math.ceil(totalTasks / limit);

            const tasksFromDB = await Task.find(filter)
                .skip(skip)
                .limit(limit)
                .lean();

            // Gắn số thứ tự
            const tasks = tasksFromDB.map((task, index) => ({
                ...task,
                stt: skip + index + 1
            }));

            if (isApi) {
                return res.status(200).json({
                    message: 'Lấy danh sách task thành công',
                    data: tasks,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalTasks: totalTasks,
                        hasPrev: page > 1,
                        hasNext: page < totalPages
                    }
                });
            }

            
            res.render("user/task", {
                tasks: tasks,
                searchKeyword: search || '',
                currentPage: page,
                totalPages: totalPages,
                hasPrev: page > 1,
                hasNext: page < totalPages,
                prevPage: page - 1,
                nextPage: page + 1,
                showPagination: totalPages > 1,
                layout: 'main'
            });

        } catch (error) {
            console.error(error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Có lỗi xảy ra khi tải danh sách công việc',
                    error: error.message
                });
            }

            res.status(500).send("Có lỗi xảy ra khi tải danh sách công việc.");
        }
    }

    edit = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const task = await Task.findById(req.params.id);
            if (isApi) {
                return res.status(200).json({
                    message: 'Lấy thông tin task thành công',
                    data: task
                });
            }

            
            res.render('user/task/edit', {
                task: task.toObject()
            });

        } catch (error) {
            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi không lấy được dữ liệu cũ!',
                    error: error.message
                });
            }

            res.status(500).send("Lỗi không lấy được dữ liệu cũ!");
        }
    }

    update = async (req, res) => {
    try {
        const isApi = req.is('application/json') ||
            req.get('accept')?.includes('application/json');

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            if (isApi) {
                return res.status(404).json({
                    message: 'Không tìm thấy task'
                });
            }

            return res.status(404).send('Không tìm thấy task');
        }

        if (isApi) {
            return res.status(200).json({
                message: 'Cập nhật thành công',
                task
            });
        }

        return res.redirect('/task');

    } catch (error) {
        console.error(error);

        const isApi = req.is('application/json') ||
            req.get('accept')?.includes('application/json');

        if (isApi) {
            return res.status(500).json({
                message: 'Lỗi cập nhật',
                error: error.message
            });
        }

        return res.status(500).send('Lỗi cập nhật');
    }
};

delete = async (req, res) => {
    try {
        
        const isApi = req.is('application/json') ||
            req.get('accept')?.includes('application/json');

        const result = await Task.deleteOne({
            _id: req.params.id
        });

        if (result.deletedCount === 0) {
            if (isApi) {
                return res.status(404).json({
                    message: 'Không tìm thấy task'
                });
            }

            return res.status(404).send('Không tìm thấy task');
        }

        
        if (isApi) {
            return res.status(200).json({
                message: 'Xóa task thành công',
                deletedId: req.params.id
            });
        }

       
        return res.redirect('/task');

    } catch (error) {
        console.error(error);

        const isApi = req.is('application/json') ||
            req.get('accept')?.includes('application/json');

        if (isApi) {
            return res.status(500).json({
                message: 'Lỗi không xóa được dữ liệu!',
                error: error.message
            });
        }

        return res.status(500).send('Lỗi không xóa được dữ liệu!');
    }
};

    
    create = (req, res) => {
        
        const isApi = req.is('application/json') ||
            req.get('accept')?.includes('application/json');

        if (isApi) {
            return res.status(200).json({
                message: 'Có thể tạo task mới'
            });
        }

        res.render('user/task/create');
    }

    store = async (req, res) => {
        try {
            
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const newTask = new Task({
                ...req.body,
                UserId: req.userId
            });

            await newTask.save();
            if (isApi) {
                return res.status(201).json({
                    message: 'Tạo task thành công',
                    data: newTask
                });
            }

            res.redirect('/task');

        } catch (error) {
            console.error(error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi lưu công việc!',
                    error: error.message
                });
            }

            res.status(500).send("Lỗi lưu công việc!");
        }
    }

}

module.exports = new TaskController();
const Task = require('../models/Task');
const mongoose = require('mongoose');

class TaskController {
    
    getUserTasks = async (req, res) => {
    try {
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
        res.status(500).send("Có lỗi xảy ra khi tải danh sách công việc.");
    }
}
    //user
    edit = async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);
            res.render('user/task/edit', { 
                task: task.toObject() 
            });
        } catch (error) {
            res.status(500).send("Lỗi không lấy được dữ liệu cũ!");
        }
    }
    
    //user
    update = async (req, res) => {
        try {
            await Task.updateOne({ _id: req.params.id }, req.body);
            res.redirect('/task');
        } catch (error) {
            res.status(500).send("Lỗi cập nhật!");
        }
    }

    //user
    delete = async (req, res) => {
        try {
            await Task.deleteOne({ _id: req.params.id });
            res.redirect('/task');
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi không xóa được dữ liệu!");
        }
    }

    //user
    create = (req, res) => {
        res.render('user/task/create');
    }
    
    
    store = async (req, res) => {
        try {
            const newTask = new Task({
                ...req.body,
                UserId: req.userId // Lấy từ middleware auth
            });
            await newTask.save();
            res.redirect('/task');
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi lưu công việc!");
        }
    }
}

module.exports = new TaskController();
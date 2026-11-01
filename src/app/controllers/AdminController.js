
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Task = require("../models/Task");
require('dotenv').config();

class AdminController {
    showDashboard = async (req, res) => {
        res.render("admin/dashboard", {
            layout: 'admin'
        });
    }

    getUsers = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const { search } = req.query;
            let filter = {};

            if (search) {
                filter.username = { $regex: search, $options: 'i' };
            }

            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const totalUsers = await User.countDocuments(filter);
            const totalPages = Math.ceil(totalUsers / limit);

            const users = await User.find(filter)
                .skip(skip)
                .limit(limit)
                .lean();

            if (isApi) {
                return res.status(200).json({
                    message: 'Lấy danh sách người dùng thành công',
                    data: users,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalUsers,
                        hasPrev: page > 1,
                        hasNext: page < totalPages
                    }
                });
            }

            res.render("admin/manage-user", {
                users: users,
                searchKeyword: search || '',
                currentPage: page,
                totalPages: totalPages,
                hasPrev: page > 1,
                hasNext: page < totalPages,
                prevPage: page - 1,
                nextPage: page + 1,
                showPagination: totalPages > 1,
                layout: 'admin'
            });
        } catch (error) {
            console.error("Lỗi:", error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi server',
                    error: error.message
                });
            }

            res.status(500).send("Lỗi server");
        }
    }

    getTasks = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const { search } = req.query;
            let filter = {};

            if (search) {
                filter.Title = { $regex: search, $options: 'i' };
            }

            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const totalTasks = await Task.countDocuments(filter);
            const totalPages = Math.ceil(totalTasks / limit);

            const tasks = await Task.find(filter)
                .populate('UserId')
                .skip(skip)
                .limit(limit)
                .lean();

            if (isApi) {
                return res.status(200).json({
                    message: 'Lấy danh sách công việc thành công',
                    data: tasks,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalTasks,
                        hasPrev: page > 1,
                        hasNext: page < totalPages
                    }
                });
            }

            res.render("admin/manage-task", {
                tasks: tasks,
                searchKeyword: search || '',
                currentPage: page,
                totalPages: totalPages,
                hasPrev: page > 1,
                hasNext: page < totalPages,
                prevPage: page - 1,
                nextPage: page + 1,
                showPagination: totalPages > 1,
                layout: 'admin'
            });
        } catch (error) {
            console.error("Lỗi:", error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi server',
                    error: error.message
                });
            }

            res.status(500).send("Lỗi server");
        }
    }

    showEditTask = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const { id } = req.params;
            const task = await Task.findById(id).lean();

            if (isApi) {
                if (!task) {
                    return res.status(404).json({
                        message: 'Không tìm thấy task'
                    });
                }

                return res.status(200).json({
                    message: 'Lấy thông tin task thành công',
                    data: task
                });
            }

            if (!task) {
                return res.status(404).send('Không tìm thấy task');
            }

            res.render("admin/edit-task", { task });
        } catch (error) {
            console.error(error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi server',
                    error: error.message
                });
            }

            res.status(500).send("Lỗi server");
        }
    }

    editTask = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const { id } = req.params;
            const input = req.body;

            const result = await Task.updateOne(
                { _id: id },
                input
            );

            if (result.matchedCount === 0) {
                if (isApi) {
                    return res.status(404).json({
                        message: 'Không tìm thấy task'
                    });
                }

                return res.status(404).send('Không tìm thấy task');
            }

            if (isApi) {
                const task = await Task.findById(id);

                return res.status(200).json({
                    message: 'Cập nhật thành công',
                    task
                });
            }

            res.redirect('/admin/manage-tasks');
        } catch (error) {
            console.error(error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi server',
                    error: error.message
                });
            }

            res.status(500).send("Lỗi server");
        }
    }

    deleteTask = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const { id } = req.params;
            const deletedTask = await Task.findByIdAndDelete(id);

            if (!deletedTask) {
                if (isApi) {
                    return res.status(404).json({
                        message: "Không tìm thấy task để xóa."
                    });
                }

                return res.status(404).send("Không tìm thấy task để xóa.");
            }

            if (isApi) {
                return res.status(200).json({
                    message: 'Xóa task thành công',
                    deletedId: id
                });
            }

            res.redirect('/admin/manage-tasks');
        } catch (error) {
            console.error(error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi server',
                    error: error.message
                });
            }

            res.status(500).send("Lỗi server");
        }
    }

    deleteUser = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const { id } = req.params;
            const deleteUser = await User.findByIdAndDelete(id);

            if (!deleteUser) {
                if (isApi) {
                    return res.status(404).json({
                        message: "Không tìm thấy user để xóa."
                    });
                }

                return res.status(404).send("Không tìm thấy user để xóa.");
            }

            if (isApi) {
                return res.status(200).json({
                    message: 'Xóa người dùng thành công',
                    deletedId: id
                });
            }

            res.redirect('/admin/manage-users');
        } catch (error) {
            console.error(error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi server',
                    error: error.message
                });
            }

            res.status(500).send("Lỗi server");
        }
    }

    showCreateTaskPage = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const users = await User.find({ role: 'user' }).lean();
            console.log(users);

            if (isApi) {
                return res.status(200).json({
                    message: 'Lấy danh sách user thành công',
                    data: users
                });
            }

            res.render("admin/create-task", {
                users: users
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách user:", error);
            res.status(500).send("Có lỗi xảy ra khi tải trang tạo công việc");
        }
    }

    createTask = async (req, res) => {
        try {
            const isApi = req.is('application/json') ||
                req.get('accept')?.includes('application/json');

            const newTask = await Task.create(req.body);

            if (isApi) {
                return res.status(201).json({
                    message: 'Tạo công việc thành công',
                    data: newTask
                });
            }

            res.redirect('/admin/manage-tasks');
        } catch (error) {
            console.error("Lỗi khi tạo công việc:", error);

            if (req.get('accept')?.includes('application/json') ||
                req.is('application/json')) {
                return res.status(500).json({
                    message: 'Lỗi khi tạo công việc',
                    error: error.message
                });
            }

            res.status(500).send("Có lỗi xảy ra khi thêm công việc mới");
        }
    }

    logout = (req, res) => {
        const isApi = req.is('application/json') ||
            req.get('accept')?.includes('application/json');

        res.clearCookie('token');

        if (isApi) {
            return res.status(200).json({
                message: 'Đăng xuất thành công'
            });
        }

        res.redirect("/user/login");
    }

    lockUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Không tìm thấy User');
        }

        user.status = "lock";

        await user.save();

        res.redirect("/admin/manage-users");

    } catch (error) {
        console.log(error);
        res.status(500).send('Lỗi server');
    }
}

 unlockUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Không tìm thấy User');
        }

        user.status = "active";

        await user.save();

        res.redirect("/admin/manage-users");

    } catch (error) {
        console.log(error);
        res.status(500).send('Lỗi server');
    }
}
}

module.exports = new AdminController();

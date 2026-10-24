const jwt = require('jsonwebtoken')
const User = require("../models/User")
const Task = require("../models/Task")
require('dotenv').config()

class AdminController{
    showDashboard = async (req,res)=>{
        res.render("admin/dashboard",{
        layout: 'admin'
        })
    }

getUsers = async (req, res) => {
    try {
        const { search } = req.query; 
        let filter = {};
        
        if (search) {
            filter.username = { $regex: search,$options: 'i' };
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
        res.status(500).send("Lỗi server");
    }
}

getTasks = async (req, res) => {
    try {
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
        res.status(500).send("Lỗi server");
    }
}

    editTask = async (req, res) => {
        try {
            const { id } = req.params;
    
            await Task.updateOne(
                { _id: id },
                {
                    Title: req.body.Title,
                    Description: req.body.Description,
                    Status0: req.body.Status0
                }
            );
    
            res.redirect('/admin/manage-tasks');
        } catch (error) {
            console.log(error);
            res.status(500).send("Lỗi server");
        }
    }

    showEditTask = async (req, res) =>{
        const {id} =req.params;
        const task = await Task.findById(id).lean();

        res.render("admin/edit-task", 
        {task})
    }

    editTask = async (req, res) => {
        try {
            const { id } = req.params;
            const input = req.body;
    
            await Task.updateOne(
                {_id: id},
                input
            );
    
            res.redirect('/admin/manage-tasks');
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi server");
        }
    }
    deleteTask = async (req, res) => {
        try {
            const { id } = req.params; 
    
            const deletedTask = await Task.findByIdAndDelete(id);
    
            if (!deletedTask) {
                return res.status(404).send("Không tìm thấy task để xóa.");
            }
    
            res.redirect('/admin/manage-tasks');
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi server"); 
        }
    }

    deleteUser = async (req, res) =>{
        try {
            const {id} = req.params;
            const deleteUser = await User.findByIdAndDelete(id);
            if (!deleteUser) {
                return res.status(404).send("Không tìm thấy user để xóa.");
            }

            res.redirect('/admin/manage-users');
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi server"); 
        }
    }

    showCreateTaskPage = async (req, res) => {
        try {
            
            const users = await User.find({role: 'user'}).lean(); 
            console.log(users)
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
           
            await Task.create(req.body); 
            
            // Sau khi lưu thành công, hãy điều hướng người dùng quay lại danh sách
            res.redirect('/admin/manage-tasks');
        } catch (error) {
            console.error("Lỗi khi tạo công việc:", error);
            res.status(500).send("Có lỗi xảy ra khi thêm công việc mới");
        }
    }
    logout = (req, res) => {
        res.clearCookie('token');
        res.redirect("/user/login");
    }


}
module.exports = new AdminController();
const jwt = require('jsonwebtoken')
const User = require("../models/User")
const Task = require("../models/Task")
const bcrypt = require('bcrypt')
require('dotenv').config()

class UserController{

    showHomePage = (req, res) => {
        res.render("user/home", { userId: req.userId });
    }
    //register
    validateInput = (username, password, confirmPassword) => {
        let errors = {};
        if (!username || username.trim().length < 3) {
            errors.username = "Username phải từ 3 ký tự.";
        }
        if (!password || password.length < 6) {
            errors.password = "Mật khẩu phải từ 6 ký tự.";
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        }
        return errors; 
    };

    showRegisterPage = (req, res) =>{

        res.render("user/register", {
            hideHeader: true
        })
    }

    register = async (req, res) => {
        const { username, password, confirmPassword } = req.body;
    
        const errors = this.validateInput(username, password, confirmPassword);
        
        if (Object.keys(errors).length > 0) {
            return res.render("user/register", { 
                hideHeader: true,
                errors: errors, 
                oldData: req.body 
            });
        }
        try {
            
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.render("user/register", { 
                    errors: { username: "Username đã tồn tại." }, 
                    oldData: req.body 
                });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ 
                username, 
                password: hashedPassword, 
                role: "user",        
                status: "unlock"    
            });            
            await newUser.save();
    
            return res.redirect("/user/login");
    
        } catch (error) {
            console.error(error);
            return res.status(500).send("Lỗi server.");
        }
    };

    validateLoginInput = (username, password) => {
        let errors = {};
        if (!username || username.trim().length === 0) {
            errors.username = "Vui lòng nhập tên đăng nhập.";
        }
        if (!password || password.length === 0) {
            errors.password = "Vui lòng nhập mật khẩu.";
        }
        return errors;
    };


    showLoginPage = (req, res) => {
        
        res.render("user/login", {
            hideHeader: true,
            hideFooter: true 
        });
    } 
    
login = async (req, res) => {
        try {
            const { username, password } = req.body;
            
            const errors = this.validateLoginInput(username, password);
            if (Object.keys(errors).length > 0) {
                return res.render("user/login", { 
                    errors: errors, 
                    oldData: req.body,
                    hideHeader: true, 
                    hideFooter: true  
                });
            }
            
            const user = await User.findOne({ username: username });
            if (!user) {
                return res.render("user/login", {
                    errors: { username: "Tên đăng nhập hoặc mật khẩu không đúng." },
                    oldData: req.body,
                    hideHeader: true, 
                    hideFooter: true
                });
            }
 
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render("user/login", {
                    errors: { password: "Tên đăng nhập hoặc mật khẩu không đúng." },
                    oldData: req.body,
                    hideHeader: true, 
                    hideFooter: true
                });
            }

            if (user.status === "lock") {
                return res.render("user/login", {
                    errors: { username: "Tài khoản của bạn đã bị khóa." },
                    oldData: req.body,
                    hideHeader: true,
                    hideFooter: true
                });
            }

            const token = jwt.sign(
                { id: user._id, username: user.username, role: user.role }, 
                process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: "1h" }
            );
    
            res.cookie('token', token, { 
                httpOnly: true,
                secure: false, 
                maxAge: 3600000 
            });
    
            if (user.role === 'admin') {
                return res.redirect("/admin/dashboard"); 
            } else {
                return res.redirect("/task"); 
            }
                
        } catch (error) {
            console.error(error);
            return res.status(500).render("user/login", {
                errors: { general: "Lỗi server, vui lòng thử lại sau." },
                oldData: req.body,
                hideHeader: true, 
                hideFooter: true
            });
        }
    }
    
    getProfile = async (req, res) => {
        try {
            console.log(req.userId)
            const user = await User.findById(req.userId).lean();
            console.log(user)
    
            if (!user) return res.status(404).send("Người dùng không tồn tại");
    
            res.render('user/profile/user-profile', { user });
        } catch (error) {
            res.status(500).send("Lỗi server");
        }
    };

    toChangeProfile = async (req, res) => {
        try {
           
            const user = await User.findById(req.userId).select('-password').lean();
            
            if (!user) {
                return res.status(404).send("Người dùng không tồn tại");
            }
    
            // Render trang view 'user/profile/change-profile' và truyền object user vào
            res.render('user/profile/change-profile', { user });
            
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi server");
        }
    };

    updateProfile = async (req, res) => {
        try {
            const { username, password } = req.body;
            const userId = req.userId; 
    
            let updateData = { username };
            if (password && password.trim() !== "") {
                updateData.password = password;
            }
    
            
            await User.updateOne({ _id: userId }, { $set: updateData });
    
            res.redirect('/user/home');
        } catch (error) {
            res.status(500).send("Lỗi cập nhật!");
        }
    }

    logout = (req, res) => {
        res.clearCookie('token');
        res.redirect("/user/login");
    }
}
    
module.exports = new UserController();
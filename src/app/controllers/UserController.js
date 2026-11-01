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
    try {
        const { username, password, confirmPassword } = req.body;

        const isApi = req.is('application/json');

        const errors = this.validateInput(username, password, confirmPassword);

        if (Object.keys(errors).length > 0) {

            if (isApi) {
                return res.status(400).json({
                    message: "Dữ liệu không hợp lệ",
                    errors
                });
            }

            return res.render("user/register", {
                hideHeader: true,
                errors,
                oldData: req.body
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {

            if (isApi) {
                return res.status(400).json({
                    message: "Username đã tồn tại."
                });
            }

            return res.render("user/register", {
                hideHeader: true,
                errors: { username: "Username đã tồn tại." },
                oldData: req.body
            });
        }

        // Mã hóa mk
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role: "user",
            status: "unlock"
        });

        await newUser.save();

        // Nếu gọi từ Swagger
        if (isApi) {
            return res.status(201).json({
                message: "Đăng ký thành công",
                data: {
                    id: newUser._id,
                    username: newUser.username,
                    role: newUser.role,
                    status: newUser.status
                }
            });
        }

        // Nếu gọi từ Website
        return res.redirect("/user/login");

    } catch (error) {
        console.error(error);

        if (req.is('application/json')) {
            return res.status(500).json({
                message: "Lỗi server"
            });
        }

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
        const isApi = req.is('application/json');

        const errors = this.validateLoginInput(username, password);

        if (Object.keys(errors).length > 0) {
            if (isApi) {
                return res.status(400).json({
                    message: "Dữ liệu không hợp lệ",
                    errors
                });
            }

            return res.status(400).render("user/login", {
                errors,
                oldData: req.body,
                hideHeader: true,
                hideFooter: true
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            if (isApi) {
                return res.status(401).json({
                    message: "Tên đăng nhập hoặc mật khẩu không đúng"
                });
            }

            return res.status(401).render("user/login", {
                errors: {
                    username: "Tên đăng nhập hoặc mật khẩu không đúng."
                },
                oldData: req.body,
                hideHeader: true,
                hideFooter: true
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            if (isApi) {
                return res.status(401).json({
                    message: "Tên đăng nhập hoặc mật khẩu không đúng"
                });
            }

            return res.status(401).render("user/login", {
                errors: {
                    password: "Tên đăng nhập hoặc mật khẩu không đúng."
                },
                oldData: req.body,
                hideHeader: true,
                hideFooter: true
            });
        }

        if (user.status === "lock") {
            if (isApi) {
                return res.status(403).json({
                    message: "Tài khoản của bạn đã bị khóa"
                });
            }

            return res.status(403).render("user/login", {
                errors: {
                    username: "Tài khoản của bạn đã bị khóa."
                },
                oldData: req.body,
                hideHeader: true,
                hideFooter: true
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        // Lưu token vào cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });

        // Nếu gọi từ Swagger
        if (isApi) {
            return res.status(200).json({
                message: "Đăng nhập thành công",
                token,
                data: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    status: user.status
                }
            });
        }

        // Nếu gọi từ Website
        if (user.role === 'admin') {
            return res.redirect("/admin/dashboard");
        }

        return res.redirect("/task");

    } catch (error) {
        console.error(error);

        if (req.is('application/json')) {
            return res.status(500).json({
                message: "Lỗi server"
            });
        }

        return res.status(500).render("user/login", {
            errors: {
                general: "Lỗi server, vui lòng thử lại sau."
            },
            oldData: req.body,
            hideHeader: true,
            hideFooter: true
        });
    }
};
    
getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy người dùng'
            });
        }

        if (req.get('accept')?.includes('application/json')) {
            return res.status(200).json({
                message: 'Lấy thông tin cá nhân thành công',
                data: user
            });
        }
        return res.render('user/profile', { user });

    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

    toChangeProfile = async (req, res) => {
        try {
           
            const user = await User.findById(req.userId).select('-password').lean();
            
            if (!user) {
                return res.status(404).send("Người dùng không tồn tại");
            }
    
            // Render trang view 'user/profile/change-profile' và truyền object user
            res.render('user/profile/change-profile', { user });
            
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi server");
        }
    };

    updateProfile = async (req, res) => {
    try {
        const isApi = req.is('application/json');
        const { username, password } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            if (isApi) {
                return res.status(404).json({
                    message: "Người dùng không tồn tại"
                });
            }

            return res.status(404).send("Người dùng không tồn tại");
        }

        let updateData = {};

        // Cập nhật username
        if (username !== undefined) {
            if (username.trim().length < 3) {
                if (isApi) {
                    return res.status(400).json({
                        message: "Username phải từ 3 ký tự"
                    });
                }

                return res.status(400).send("Username phải từ 3 ký tự");
            }

            const existingUser = await User.findOne({
                username,
                _id: { $ne: userId }
            });

            if (existingUser) {
                if (isApi) {
                    return res.status(400).json({
                        message: "Username đã tồn tại"
                    });
                }

                return res.status(400).send("Username đã tồn tại");
            }

            updateData.username = username.trim();
        }

        // Cập nhật password
        if (password && password.trim() !== "") {
            if (password.length < 6) {
                if (isApi) {
                    return res.status(400).json({
                        message: "Mật khẩu phải từ 6 ký tự"
                    });
                }

                return res.status(400).send("Mật khẩu phải từ 6 ký tự");
            }

            updateData.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            if (isApi) {
                return res.status(400).json({
                    message: "Không có dữ liệu cập nhật"
                });
            }

            return res.status(400).send("Không có dữ liệu cập nhật");
        }

        await User.updateOne(
            { _id: userId },
            { $set: updateData }
        );

        // Swagger
        if (isApi) {
            return res.status(200).json({
                message: "Cập nhật thông tin thành công",
                data: {
                    username: updateData.username || user.username
                }
            });
        }

        // Website
        return res.redirect('/user/home');

    } catch (error) {
        console.error(error);

        if (req.is('application/json')) {
            return res.status(500).json({
                message: "Lỗi cập nhật thông tin"
            });
        }

        return res.status(500).send("Lỗi cập nhật!");
    }
};

    logout = (req, res) => {
    res.clearCookie('token');

    if (req.is('application/json')) {
        return res.status(200).json({
            message: "Đăng xuất thành công"
        });
    }

    return res.redirect("/user/login");
};
}
    
module.exports = new UserController();
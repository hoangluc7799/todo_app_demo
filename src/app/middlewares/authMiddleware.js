//check JWT
const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    const cookieToken = req.cookies ? req.cookies.token : null;
    
    const token = (authHeader && authHeader.split(' ')[1]) || cookieToken;

    console.log("Token nhận được:", token);

    if (!token) {
        return res.redirect('/user/login'); 
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.id;
        console.log("Thành công")
        next();
    } catch (error) {
        console.log("Lỗi verify:", error.message);
        return res.redirect('/user/login');
    }
}

module.exports = verifyToken
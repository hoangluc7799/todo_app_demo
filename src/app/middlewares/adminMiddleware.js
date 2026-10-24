const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {

    const token = req.cookies ? req.cookies.token : null;
    if (!token) {
        return res.status(401).send("Bạn cần đăng nhập!");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).send("Bạn không có quyền truy cập vào trang này!");
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send("Token không hợp lệ!");
    }
};

module.exports = verifyAdmin
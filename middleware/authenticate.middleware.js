const jwt = require("jsonwebtoken");

const authenticateMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized: Token tidak ditemukan",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Forbidden: Token tidak valid atau kadaluarsa",
            status: 403
        });
    }
};

module.exports = authenticateMiddleware;

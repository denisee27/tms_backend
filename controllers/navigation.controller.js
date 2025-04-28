const db = require("../config/db.config.js");
const Navigation = db.navigation;

exports.findAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortDueDate = req.query.sortDueDate || null;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Navigation.findAndCountAll();
        res.json({
            data: rows,
            totalData: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
};

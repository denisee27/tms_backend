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


exports.create = async (req, res) => {
    try {
        const { parent_id, name, icon, link, action, position, status } = req.body;
        await Navigation.create({ parent_id, name, icon, link, action, position, status });
        res.status(200).json({ message: "ok" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
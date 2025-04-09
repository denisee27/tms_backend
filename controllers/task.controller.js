const db = require("../models");
const Joi = require("joi");
const Task = db.task;

exports.findAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortDueDate = req.query.sortDueDate || null;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Task.findAndCountAll({
            limit,
            offset,
            order: sortDueDate ? [["due_date", sortDueDate]] : [["createdAt", "ASC"]],
        });
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

exports.updateMark = async (req, res) => {
    const schema = Joi.object({
        status: Joi.boolean().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const { id } = req.params;
        const { status } = req.body;
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: "Data not found" });
        }
        await task.update({ status });
        res.status(200).json({ message: "ok" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.create = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        description: Joi.string().min(10).max(200).required(),
        due_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const { title, description, due_date } = req.body;
        await Task.create({ title, description, due_date });
        res.status(200).json({ message: "ok" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.update = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        description: Joi.string().min(10).max(200).required(),
        due_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const { id } = req.params;
        const { title, description, due_date } = req.body;
        const findId = await Task.findByPk(id);
        if (!findId) {
            return res.status(404).json({ message: "Data not found" });
        }
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: "Data not found" });
        }
        await task.update({
            title: title || task.title,
            description: description || task.description,
            due_date: due_date || task.due_date,
        });

        res.json({ message: "ok" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: "data not found" });
        }
        await task.destroy();
        res.json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};



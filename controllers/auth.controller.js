const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../config/db.config.js");
const User = db.user;
const multer = require('multer');
const form = multer();

exports.register = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        return res.status(200).json({ message: "ok" });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

exports.login = [form.none(),
async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400, wrong: error.details.context.key, message: error.details[0].message
        })
    };

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(442).json({
                status: 422,
                wrong:
                    { email: "Email or Password is incorrect" }
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(442).json({
                status: 422,
                wrong:
                    { password: "Email or Password is incorrect" }
            });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            message: "ok",
            result: {
                access_token: token,
                token_type: "Bearer",
                timeout: 3600,
                user: {
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}];

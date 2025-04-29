const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const authController = require("../controllers/auth.controller");
const navigationController = require("../controllers/navigation.controller");
const authenticateMiddleware = require("../middleware/authenticate.middleware");

router.get("/", (res) => {
    res.json({ message: "API Running" });
});
const task = express.Router();
router.use("/tasks", task);
task.get("/", authenticateMiddleware, taskController.findAll);
task.post("/create", authenticateMiddleware, taskController.create);
task.put("/update/:id", authenticateMiddleware, taskController.update);
task.delete("/delete/:id", authenticateMiddleware, taskController.delete);
task.patch("/mark/:id", authenticateMiddleware, taskController.updateMark);

const navigation = express.Router();
router.use('/navigations', navigation);
navigation.get("/", authenticateMiddleware, navigationController.findAll);
navigation.post("/create", authenticateMiddleware, navigationController.findAll);


router.post("/auth/login", authController.login)
router.post("/auth/register", authController.register)
module.exports = router;
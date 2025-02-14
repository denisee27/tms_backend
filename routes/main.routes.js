const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");

router.get("/", (res) => {
    res.json({ message: "API Running" });
});
router.get("/tasks", taskController.findAll);
router.post("/tasks/create", taskController.create);
router.put("/tasks/update/:id", taskController.update);
router.delete("/tasks/delete/:id", taskController.delete);
router.patch("/tasks/mark/:id", taskController.updateMark);

module.exports = router;
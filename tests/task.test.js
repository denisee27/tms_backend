const request = require("supertest");
const app = require("../app");
const db = require("../models");

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});
describe("Task API Endpoints", () => {
    let taskId;

    test("GET /api/tasks - Should return list task", async () => {
        const res = await request(app).get("/api/tasks");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("POST /api/tasks/create - Should create new task", async () => {
        const res = await request(app)
            .post("/api/tasks/create")
            .send({
                title: "Test Task",
                description: "Test Description",
                due_date: "2024-12-31"
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "ok");
    });

    test("PUT /api/tasks/update/:id - Should update task", async () => {
        const task = await db.task.create({
            title: "Task Update",
            description: "Deskripsi Update",
            due_date: "2024-12-31"
        });
        taskId = task.id;

        const res = await request(app)
            .put(`/api/tasks/update/${taskId}`)
            .send({
                title: "Task Baru",
                description: "Deskripsi Baru"
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "ok");

        const updatedTask = await db.task.findByPk(taskId);
        expect(updatedTask.title).toBe("Task Baru");
        expect(updatedTask.description).toBe("Deskripsi Baru");
    });

    test("PATCH /api/tasks/mark/:id - Should chanhge status task", async () => {
        const res = await request(app)
            .patch(`/api/tasks/mark/${taskId}`)
            .send({ status: true });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "ok");

        const updatedTask = await db.task.findByPk(taskId);
        expect(updatedTask.status).toBe(true);
    });

    test("DELETE /api/tasks/delete/:id - Should delete task", async () => {
        const res = await request(app).delete(`/api/tasks/delete/${taskId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Data deleted successfully");

        const deletedTask = await db.task.findByPk(taskId);
        expect(deletedTask).toBeNull();
    });
});

afterAll(async () => {
    await db.sequelize.close();
});

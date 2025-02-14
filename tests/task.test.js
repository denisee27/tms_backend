const request = require("supertest");
const app = require("../app");
const db = require("../models");

let taskId;

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

beforeEach(async () => {
    const task = await db.task.create({
        title: "Task Test",
        description: "Deskripsi Test",
        due_date: "2024-12-31",
        status: false
    });
    taskId = task.id;
});

afterAll(async () => {
    await db.sequelize.close();
});

test("POST /api/tasks/create - Should create a new task", async () => {
    const res = await request(app)
        .post("/api/tasks/create")
        .send({
            title: "New Task",
            description: "New Description",
            due_date: "2024-12-31",
        })
        .expect("Content-Type", /json/)
        .expect(200);
    expect(res.body).toHaveProperty("message", "ok");
});

test("GET /api/tasks - Should return task list", async () => {
    const res = await request(app)
        .get("/api/tasks")
        .expect("Content-Type", /json/)
        .expect(200);

    expect(res.body).toHaveProperty("data");
    expect(res.body.data.length).toBeGreaterThan(0);
});


test("PUT /api/tasks/update/:id - Should update task", async () => {
    const res = await request(app)
        .put(`/api/tasks/update/${taskId}`)
        .send({
            title: "Updated Task",
            description: "Updated Description",
            due_date: "2024-12-31",
        })
        .expect("Content-Type", /json/)
        .expect(200);

    expect(res.body).toHaveProperty("message", "ok");

    const updatedTask = await db.task.findByPk(taskId);
    expect(updatedTask.title).toBe("Updated Task");
    expect(updatedTask.description).toBe("Updated Description");
});

test("PATCH /api/tasks/mark/:id - Should update task status", async () => {
    const res = await request(app)
        .patch(`/api/tasks/mark/${taskId}`)
        .send({ status: true })
        .expect(200);

    expect(res.body).toHaveProperty("message", "ok");

    const updatedTask = await db.task.findByPk(taskId);
    expect(updatedTask.status).toBe(true);
});

test("DELETE /api/tasks/delete/:id - Should delete task", async () => {
    const res = await request(app)
        .delete(`/api/tasks/delete/${taskId}`)
        .expect("Content-Type", /json/)
        .expect(200);

    expect(res.body).toHaveProperty("message", "Data deleted successfully");

    const deletedTask = await db.task.findByPk(taskId);
    expect(deletedTask).toBeNull();
});

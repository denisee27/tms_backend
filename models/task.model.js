module.exports = (sequelize, Sequelize) => {
    const paginate = require("sequelize-paginate");
    const Task = sequelize.define("tasks", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        due_date: {
            type: Sequelize.DATEONLY
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        }
    });
    paginate.paginate(Task);

    return Task;
};
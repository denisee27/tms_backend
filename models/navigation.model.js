module.exports = (sequelize, Sequelize) => {
    const paginate = require("sequelize-paginate");
    const Navigation = sequelize.define("navigations", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
    });
    paginate.paginate(Navigation);

    return Navigation;
};
module.exports = (sequelize, Sequelize) => {
    const Navigation = sequelize.define("navigations", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        parent_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            references: {
                model: 'navigations',
                key: 'id',
            },
        },
        name: {
            type: Sequelize.STRING(128),
            allowNull: false
        },
        icon: {
            type: Sequelize.STRING(64),
            allowNull: true
        },
        link: {
            type: Sequelize.STRING(64),
            allowNull: true
        },
        action: {
            type: Sequelize.JSON,
            allowNull: true
        },
        position: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'navigations',
        modelName: 'Navigation',
        timestamps: true,
    });
    Navigation.associate = (models) => {
        Navigation.belongsTo(models.Navigation, {
            as: 'Parent',
            foreignKey: 'parent_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        Navigation.hasMany(models.Navigation, {
            as: 'Children',
            foreignKey: 'parent_id'
        });
    };
    return Navigation;
};
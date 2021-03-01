module.exports = (sequelize, Sequelize) => {
    return sequelize.define("report", {
        userId: {
            type: Sequelize.INTEGER(21)
        },
        reporterId: {
            type: Sequelize.INTEGER(21)
        },
        content: {
            type: Sequelize.STRING(1200)
        },
        status: {
            type: Sequelize.STRING(2)
        },
        type: {
            type: Sequelize.INTEGER(4)
        },
        createdDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: false,
        underscored: false,
    });
};

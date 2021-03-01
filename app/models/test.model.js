module.exports = (sequelize, Sequelize) => {
    return sequelize.define("test", {
        userId: {
            type: Sequelize.INTEGER(10),
        },
        point: {
            type: Sequelize.INTEGER(10),
        },
    }, {
        timestamps: false,
        underscored: false,
    });
};

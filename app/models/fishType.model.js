module.exports = (sequelize, Sequelize) => {
    return sequelize.define("fishType", {
        name: {
            type: Sequelize.STRING(100)
        },
        createdDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: false,
        underscored: false,
    });
};

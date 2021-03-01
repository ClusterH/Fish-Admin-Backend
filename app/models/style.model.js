module.exports = (sequelize, Sequelize) => {
    return sequelize.define("style", {
        name: {
            type: Sequelize.STRING(30)
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

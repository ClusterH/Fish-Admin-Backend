module.exports = (sequelize, Sequelize) => {
    return sequelize.define("emailVerification", {
        userId: {
            type: Sequelize.INTEGER(21)
        },
        code: {
            type: Sequelize.STRING(8)
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

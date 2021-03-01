module.exports = (sequelize, Sequelize) => {
    return sequelize.define("emailCertification", {
        userId: {
            type: Sequelize.INTEGER(21)
        },
        email: {
            type: Sequelize.STRING(50)
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

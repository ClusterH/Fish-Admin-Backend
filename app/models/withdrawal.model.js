module.exports = (sequelize, Sequelize) => {
    return sequelize.define("withdrawal", {
        userId: {
            type: Sequelize.INTEGER(21)
        },
        pointAmount: {
            type: Sequelize.INTEGER(20)
        },
        receiverName: {
            type: Sequelize.STRING(50)
        },
        phoneNumber: {
            type: Sequelize.STRING(20)
        },
        accountTypeId: {
            type: Sequelize.INTEGER(3),
        },
        accountNumber: {
            type: Sequelize.STRING(30)
        },
        citizenNumber: {
            type: Sequelize.STRING(30)
        },
        status: {
            type: Sequelize.INTEGER(2),
            defaultValue: 0
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

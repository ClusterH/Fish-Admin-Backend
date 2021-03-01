module.exports = (sequelize, Sequelize) => {
    return sequelize.define("quickMemo", {
        userId: {
            type: Sequelize.INTEGER(21)
        },
        memo: {
            type: Sequelize.STRING(300)
        },
        address: {
            type: Sequelize.STRING(256)
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

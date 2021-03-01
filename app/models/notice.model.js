module.exports = (sequelize, Sequelize) => {
    return sequelize.define("notice", {
        noticeTypeId: {
            type: Sequelize.INTEGER(2)
        },
        title: {
            type: Sequelize.STRING(40),
        },
        content: {
            type: Sequelize.STRING(2000),
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

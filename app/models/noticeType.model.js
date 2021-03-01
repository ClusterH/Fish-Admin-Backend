module.exports = (sequelize, Sequelize) => {
    return sequelize.define("noticeType", {
        type: {
            type: Sequelize.STRING(20)
        },
        createdDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    }, {
        timestamps: false,
        underscored: false,
    });
};

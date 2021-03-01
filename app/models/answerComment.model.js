module.exports = (sequelize, Sequelize) => {
    return sequelize.define("answerComment", {
        questionId: {
            type: Sequelize.INTEGER(21)
        },
        userId: {
            type: Sequelize.INTEGER(21)
        },
        comment: {
            type: Sequelize.STRING(300)
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

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("question", {
        question: {
            type: Sequelize.STRING(1000)
        },
        userId: {
            type: Sequelize.INTEGER(21)
        },
        questionDate: {
            type: Sequelize.DATE,
        },
        answer: {
            type: Sequelize.STRING(2000)
        },
        answerDate: {
            type: Sequelize.DATE,
        },
        status: {
            type: Sequelize.INTEGER(4),
        }
    }, {
        timestamps: false,
        underscored: false,
    });
};

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("postComment", {
        postId: {
            type: Sequelize.INTEGER(21)
        },
        userId: {
            type: Sequelize.STRING(100)
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

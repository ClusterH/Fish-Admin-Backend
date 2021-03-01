module.exports = (sequelize, Sequelize) => {
    return sequelize.define("postImage", {
        postId: {
            type: Sequelize.INTEGER(21)
        },
        image: {
            type: Sequelize.STRING(254)
        },
    }, {
        timestamps: false,
        underscored: false,
    });
};



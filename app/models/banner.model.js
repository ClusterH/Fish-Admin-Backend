module.exports = (sequelize, Sequelize) => {
    return sequelize.define("banner", {
        title: {
            type: Sequelize.STRING(20)
        },
        subtitle: {
            type: Sequelize.STRING(30)
        },
        image: {
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

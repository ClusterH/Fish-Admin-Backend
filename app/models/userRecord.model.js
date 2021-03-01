module.exports = (sequelize, Sequelize) => {
    return sequelize.define("userRecord", {
        userId: {
            type: Sequelize.INTEGER(21),
        },
        fishId: {
            type: Sequelize.INTEGER(21),
        },
        record: {
            type: Sequelize.DOUBLE,
        },
        fishTypeId: {
            type: Sequelize.INTEGER(21),
        },
        // fishImage: {
        //     type: Sequelize.STRING(255),
        // }
    }, {
        timestamps: false,
        underscored: false,
    });
};

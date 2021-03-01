module.exports = (sequelize, Sequelize) => {
    return sequelize.define("competition", {
        type: {
            type: Sequelize.INTEGER(4),
        },
        name: {
            type: Sequelize.STRING(256)
        },
        description: {
            type: Sequelize.STRING(1200)
        },
        image: {
            type: Sequelize.STRING(256)
        },
        startDate: {
            type: Sequelize.DATE,
        },
        endDate: {
            type: Sequelize.DATE,
        },
        maxAttendNumber: {
            type: Sequelize.INTEGER(21)
        },
        startApplication: {
            type: Sequelize.DATE
        },
        endApplication: {
            type: Sequelize.DATE
        },
        duplicateAllow: {
            type: Sequelize.BOOLEAN
        },
        totalReward: {
            type: Sequelize.INTEGER(20)
        },
        fishTypeId: {
            type: Sequelize.INTEGER(21)
        },
        mode: {
            type: Sequelize.INTEGER(2),
            defaultValue: 0,
        },
        rankFishNumber: {
            type: Sequelize.INTEGER(10)
        },
        questFishNumber: {
            type: Sequelize.INTEGER(10)
        },
        questFishWidth: {
            type: Sequelize.DOUBLE
        },
        questSpecialWidth: {
            type: Sequelize.DOUBLE
        },
        reward1: {
            type: Sequelize.INTEGER(20),
            defaultValue: 0,
        },
        reward2: {
            type: Sequelize.INTEGER(20),
            defaultValue: 0,
        },
        reward3: {
            type: Sequelize.INTEGER(20),
            defaultValue: 0,
        },
        attendCost: {
            type: Sequelize.INTEGER(20)
        },
        termsAndConditions: {
            type: Sequelize.STRING(1200)
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

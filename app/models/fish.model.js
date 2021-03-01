module.exports = (sequelize, Sequelize) => {
    return sequelize.define("fish", {
        userId: {
            type: Sequelize.INTEGER(21)
        },
        competitionId: {
            type: Sequelize.INTEGER(21)
        },
        fishTypeId: {
            type: Sequelize.INTEGER(21)
        },
        fishWidth: {
            type: Sequelize.DOUBLE
        },
        status: {
            type: Sequelize.INTEGER(2), //0-pending, 1-accept, 2-reject
            defaultValue: 0,
        },
        address: {
            type: Sequelize.STRING(255),
        },
        note: {
            type: Sequelize.STRING(1000),
        },
        temperatures: {
            type: Sequelize.DOUBLE
        },
        humidity: {
            type: Sequelize.DOUBLE
        },
        precipitation: {
            type: Sequelize.DOUBLE
        },
        atmosphericPressure: {
            type: Sequelize.DOUBLE
        },
        sunrise: {
            type: Sequelize.DATE,
        },
        sunset: {
            type: Sequelize.DATE,
        },
        sunshine: {
            type: Sequelize.DOUBLE,
        },
        moonrise: {
            type: Sequelize.DATE,
        },
        moonset: {
            type: Sequelize.DATE,
        },
        windSpeed: {
            type: Sequelize.DOUBLE,
        },
        temperatureChange1: {
            type: Sequelize.DOUBLE,
        },
        temperatureChange2: {
            type: Sequelize.DOUBLE,
        },
        temperatureChange3: {
            type: Sequelize.DOUBLE,
        },
        temperatureChange4: {
            type: Sequelize.DOUBLE,
        },
        temperatureChange5: {
            type: Sequelize.DOUBLE,
        },
        temperatureChange6: {
            type: Sequelize.DOUBLE,
        },
        precipitationChange1: {
            type: Sequelize.DOUBLE
        },
        precipitationChange2: {
            type: Sequelize.DOUBLE
        },
        precipitationChange3: {
            type: Sequelize.DOUBLE
        },
        precipitationChange4: {
            type: Sequelize.DOUBLE
        },
        precipitationChange5: {
            type: Sequelize.DOUBLE
        },
        precipitationChange6: {
            type: Sequelize.DOUBLE
        },
        windSpeedChange1: {
            type: Sequelize.DOUBLE
        },
        windSpeedChange2: {
            type: Sequelize.DOUBLE
        },
        windSpeedChange3: {
            type: Sequelize.DOUBLE
        },
        windSpeedChange4: {
            type: Sequelize.DOUBLE
        },
        windSpeedChange5: {
            type: Sequelize.DOUBLE
        },
        windSpeedChange6: {
            type: Sequelize.DOUBLE
        },
        pressureChange1: {
            type: Sequelize.DOUBLE
        },
        pressureChange2: {
            type: Sequelize.DOUBLE
        },
        pressureChange3: {
            type: Sequelize.DOUBLE
        },
        pressureChange4: {
            type: Sequelize.DOUBLE
        },
        pressureChange5: {
            type: Sequelize.DOUBLE
        },
        pressureChange6: {
            type: Sequelize.DOUBLE
        },
        weather: {
            type: Sequelize.INTEGER(4),
            defaultValue: 0
        },
        startHour: {
            type: Sequelize.INTEGER(3)
        },
        registerDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    }, {
        timestamps: false,
        underscored: false,
    });
};


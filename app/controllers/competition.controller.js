const db = require("../models");
const Competition = db.competition;
const UserCompetition = db.userCompetition;
const Fish = db.fish;
const FishType = db.fishType;
const User = db.user;
const Profile = db.profile;
const Op = db.Sequelize.Op;

/**
 * Register Competition
 * @param req keys: {...}
 * @param res
 * @returns {token}
 */
exports.registerCompetition = async (req, res) => {
    const newCompetition = {
        ...req.body
    };

    Competition.create(newCompetition)
        .then(data => {
            return res.status(200).send({result: 'COMPETITION.REGISTER', data: data.id});
        })
        .catch(err => {
            return res.status(500).send({msg: err.toString()});
        });
};


exports.updateCompetition = async (req, res) => {
    try {
        const competitionId = req.body.competitionId;

        const competition = await Competition.findOne({
            where: {id: competitionId}
        });

        if (!competition) {
            return res.status(404).send({msg: 'COMPETITION.NOT_FOUND'});
        }

        const keys = Object.keys(req.body);
        for (const key of keys) {
            if (key !== 'competitionId') {
                competition[key] = req.body[key];
            }
        }
        await competition.save();

        return res.status(200).send({result: 'COMPETITION.UPDATE_SUCCESS'});
    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
};

// exports.getCompetitionById = async (req, res) => {
//     const competitionId = req.body.competitionId;
//
//     const cntUser = await Diary.count({
//         where: {id: competitionId}
//     });
//
//     Competition.findOne({
//         where: {id: competitionId}
//     }).then(async data => {
//         return res.status(200).send({result: {...data.dataValues, userCount: cntUser}});
//     }).catch(err => {
//         return res.status(500).send({msg: err.toString()});
//     })
// };

exports.getCompetitionById = async (req, res) => {
    try {
        const competitionId = req.body.competitionId;
        const userId = req.body.userId; //login user id

        const competition = await Competition.findOne({
            where: {id: competitionId},
            include: [{
                model: FishType,
                attributes: ['id', 'name']
            }]
        });

        const cntUser = await UserCompetition.count({
            where: {competitionId: competitionId}
        });

        const sortingKey = ['DESC', 'DESC', 'DESC', 'DESC', 'ASC'];

        let winners = [];
        if (competition.mode > 0) {
            winners = await UserCompetition.findAll({
                limit: 3,
                order: [[`record${competition.mode}`, sortingKey[competition.mode - 1]]],
                attributes: ['id', `record${competition.mode}`],
                where: {
                    competitionId: competitionId,
                },
                include: [{
                    model: User,
                    attributes: ['id'],
                    include: [{
                        model: Profile,
                        attributes: ['id', 'username', 'style', 'level', 'avatar']
                    }]
                }]
            });
        }

        const myStatus = await UserCompetition.findOne({
            where: {
                competitionId: competitionId,
                userId: userId || 0,
            }
        })

        return res.status(200).send({result: {...competition.dataValues, userCount: cntUser}, ranking: winners, myStatus: !!myStatus});
    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
};

exports.getAllCompetitions = async (req, res) => {
    try {
        const totalCount = await Competition.count();

        const competitions = await Competition.findAll({
            limit: req.body.limit || 1000000,
            offset: req.body.offset || 0,
            include: [{
                model: FishType
            }]
        });

        return res.status(200).send({result: competitions, totalCount: totalCount});
    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
};

exports.getNewCompetition = (req, res) => {
    Competition.findAll({
        limit: req.body.limit || 1000000,
        offset: req.body.offset || 0,
        order: [['startDate', 'ASC']],
        where: {
            startDate: {
                [Op.gt]: (new Date()).getTime()
            }
        },
        include: [{
            model: FishType
        }]
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
}

exports.deleteCompetitionById = (req, res) => {
    const competitionId = req.body.competitionId;

    Competition.destroy({
        where: {id: competitionId}
    }).then(cnt => {
        return res.status(200).send({result: cnt});
    }).catch(err => {
        return res.status(200).send({msg: err.toString()});
    })
};

exports.getProgressingCompetitions = (req, res) => {
    const now = new Date();

    Competition.findAll({
        limit: req.body.limit || 1000000,
        offset: req.body.offset || 0,
        where: {
            startDate: {
                [Op.lte]: now.getTime()
            },
            endDate: {
                [Op.gte]: now.getTime()
            }
        }
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getProgressingCompetitionsByUser = (req, res) => {
    const now = new Date();

    UserCompetition.findAll({
        limit: req.body.limit || 1000000,
        offset: req.body.offset || 0,
        where: {userId: req.body.userId},
        include: [{
            model: Competition,
            where: {
                startDate: {
                    [Op.lte]: now.getTime()
                },
                endDate: {
                    [Op.gte]: now.getTime()
                }
            },
            include: [{
                model: FishType
            }]
        }]
    }).then(data => {
        return res.status(200).send({result: data, totalCount: data.length});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getAttendedCompetitionsByUser = (req, res) => {
    const now = new Date();

    UserCompetition.findAll({
        limit: req.body.limit || 1000000,
        offset: req.body.offset || 0,
        where: {userId: req.body.userId},
        include: [{
            model: Competition,
            where: {
                endDate: {
                    [Op.lt]: now.getTime()
                }
            },
            include: [{
                model: FishType
            }]
        }]
    }).then(data => {
        return res.status(200).send({result: data, totalCount: data.length});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getRankCompetitions = (req, res) => {
    Competition.findAll({
        limit: req.body.limit || 1000000,
        offset: req.body.offset || 0,
        where: {
            mode: 1
        }
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getQuestCompetitions = (req, res) => {
    Competition.findAll({
        limit: req.body.limit || 1000000,
        offset: req.body.offset || 0,
        where: {
            mode: {
                [Op.gt]: 1
            }
        }
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getCompetitionByMultiFilter = async (req, res) => {
    const type = req.body.type;
    const mode = req.body.mode;
    const status = req.body.status;
    const filter = {};
    const now = new Date();

    if (type) filter.type = type;
    if (mode === 1) filter.mode = 1;
    if (mode === 2) filter.mode = {
        [Op.gt]: 1
    }
    if (status === 1) {
        filter.endDate = {
            [Op.lt]: now.getTime()
        };
    } else if (status === 2) {
        filter.startDate = {
            [Op.lt]: now.getTime()
        };
        filter.endDate = {
            [Op.gt]: now.getTime()
        };
    } else if (status === 3) {
        filter.startDate = {
            [Op.gt]: now.getTime()
        };
    }

    try {
        const count = await Competition.count({
            where: filter
        });

        const data = await Competition.findAll({
            limit: req.body.limit || 1000000,
            offset: req.body.offset || 0,
            where: filter
        });

        return res.status(200).send({result: data, totalCount: count});
    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
}

/**
 * Get Ranking of the competition
 * @param req keys: {competitionId, limit}
 * @param res
 * @returns {Promise<void>}
 */
exports.getCompetitionRanking = async (req, res) => {

    try {
        const competitionId = req.body.competitionId;
        const limit = req.body.limit;

        const competition = await Competition.findOne({
            where: {id: competitionId}
        });

        const sortingKey = ['DESC', 'DESC', 'DESC', 'DESC', 'ASC'];

        let data = [];

        if (competition.mode > 0) {
            data = await UserCompetition.findAll({
                limit: limit || 1000000,
                order: [[`record${competition.mode}`, sortingKey[competition.mode - 1]]],
                attributes: ['id', `record${competition.mode}`],
                where: {
                    competitionId: competitionId,
                },
                include: [{
                    model: User,
                    attributes: ['id', 'name'],
                    include: [{
                        model: Profile,
                        attributes: ['id', 'username', 'style', 'level', 'avatar']
                    }]
                }]
            });
        }
        const myRanking = data.findIndex(x => x.user.id === req.body.userId);

        return res.status(200).send({result: data, myRanking: myRanking + 1});
    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
};


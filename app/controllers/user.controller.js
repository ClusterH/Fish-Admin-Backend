

const db = require("../models");
const User = db.user;
const Profile = db.profile;
// const Diary = db.diary;
const UserCompetition = db.userCompetition;
const Competition = db.competition;
const Op = db.Sequelize.Op;

/**
 * Register Profile
 * @param req keys: {userId, username, introMe, avatar, serviceAlarm, adAlarm}
 * @param res
 * @returns {token}
 */
exports.registerProfile = (req, res) => {
    const newProfile = {
        ...req.body
    };
    Profile.create(newProfile)
        .then(data => {
            return res.status(200).send({result: 'USER.PROFILE_REGISTER_SUCCESS', data: data.id});
        })
        .catch(err => {
            return res.status(500).send({msg: err.toString()});
        });
};


exports.updateProfile = async (req, res) => {
    try {
        const profileId = req.body.profileId;
        const userId = req.body.userId;
        // const filter = profileId ? {id: profileId} : userId ? {userId: userId} : null;
        //
        // if (filter === null) {
        //     return res.status(404).send({msg: 'USER.PROFILE_NOT_FOUND'});
        // }

        const profile = await Profile.findOne({
            where: {userId: userId}
        });

        if (!profile) {
            return res.status(404).send({msg: 'USER.PROFILE_NOT_FOUND'});
        }

        const keys = Object.keys(req.body);
        console.log(keys)
        for (const key of keys) {
            if (key !== 'profileId' && key !== 'userId') {
                profile[key] = req.body[key];
            }
        }
        await profile.save();

        return res.status(200).send({result: 'USER.PROFILE_UPDATE_SUCCESS'});
    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
};

exports.getProfileById = (req, res) => {
    const profileId = req.body.profileId;

    Profile.findOne({
        where: {id: profileId}
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getProfileByUserId = (req, res) => {
    const userId = req.body.userId;

    Profile.findOne({
        where: {userId: userId}
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
};

exports.getAllUsers = async (req, res) => {
    try {
        const userCount = await User.count({
            where: {type: 1}
        });

        const users = await User.findAll({
            limit: req.body.limit || 1000000,
            offset: req.body.offset || 0,
            where: {type: 1},
            attributes: {exclude: ['password']},
        });

        return res.status(200).send({result: users, totalCount: userCount});
    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }
}

exports.getUserById = (req, res) => {
    const userId = req.body.userId;

    User.findOne({
        where: {id: userId}
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
}

exports.getFullUserInfo = (req, res) => {
    const userId = req.body.userId;

    User.findOne({
        where: {id: userId},
        attributes: {exclude: ['password']},
        include: [{
            model: Profile,
        }]
    }).then(data => {
        return res.status(200).send({result: data});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
}

exports.deleteUserById = (req, res) => {
    const userId = req.body.userId;

    User.destroy({
        where: {id: userId}
    }).then(cnt => {
        return res.status(200).send({result: cnt});
    }).catch(err => {
        return res.status(500).send({msg: err.toString()});
    })
}

exports.getRecordByUser = async (req, res) => {
    const userId = req.body.userId;
    let totalDiaryCount = 0;
    let rankDiaryCount = 0;
    let questDiaryCount = 0;
    let rankChampionshipCount = 0;
    let questChampionshipCount = 0;

    const myCompetitions = await UserCompetition.findAll({
        where: {userId: userId},
        include: [{
            model: Competition,
        }]
    });

    totalDiaryCount = myCompetitions.length;

    for (const item of myCompetitions) {
        if (item.competition.mode === 1) {
            rankDiaryCount += 1;

            const maxScore = await UserCompetition.max('record1', {
                where: {competitionId: item.competition.id}
            });

            if (item.record1 === maxScore) rankChampionshipCount += 1;
        } else {
            questDiaryCount += 1;

            const comp = await Competition.findOne({
                where: {id: item.competition.id}
            });

            if (item.competition.mode === 2) {
                if (item.record2 >= comp.questFishWidth) questChampionshipCount += 1;
            } else if (item.competition.mode === 3) {
                if (item.record3 >= comp.questFishNumber) questChampionshipCount += 1;
            } else if (item.competition.mode === 4) {
                if (item.record4 >= comp.questFishNumber) questChampionshipCount += 1;
            } else {
                const minBias = await UserCompetition.min('record5', {
                    where: {competitionId: item.competition.id}
                });

                if (item.record5 === minBias) questChampionshipCount += 1;
            }
        }
    }

    const data = {
        totalDiaryCount,
        rankDiaryCount,
        questDiaryCount,
        rankChampionshipCount,
        questChampionshipCount,
    }

    return res.status(200).send({result: data});
}

const Test = db.test
exports.testing = async (req, res) => {
    console.log("***********************")
    try {
        const data = await Test.findAll({
            // order: [['point', 'DESC']],
            attributes: [
                'id', 'point',
                [db.Sequelize.literal('(RANK() OVER (ORDER BY point DESC))'), 'rank']
            ]
        });

        return res.status(200).send({result: data});
    } catch (err) {
        return res.status(500).send({msg: err.toString()});
    }

}


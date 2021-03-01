const {authJwt} = require("../middleware");
const controller = require("../controllers/competition.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/competition/register",
        [authJwt.verifyToken],
        controller.registerCompetition
    );

    app.all(
        "/competition/update",
        [authJwt.verifyToken],
        controller.updateCompetition
    );

    app.all(
        "/competition/get-all",
        [authJwt.verifyToken],
        controller.getAllCompetitions
    );

    app.all(
        "/competition/get-by-id",
        [authJwt.verifyToken],
        controller.getCompetitionById
    );

    app.all(
        "/competition/delete",
        [authJwt.verifyToken],
        controller.deleteCompetitionById
    );

    app.all(
        "/competition/get-progressing",
        [authJwt.verifyToken],
        controller.getProgressingCompetitions
    );

    app.all(
        "/competition/get-progressing-by-user",
        [authJwt.verifyToken],
        controller.getProgressingCompetitionsByUser
    );

    app.all(
        "/competition/get-attended-by-user",
        [authJwt.verifyToken],
        controller.getAttendedCompetitionsByUser
    );

    app.all(
        "/competition/get-new",
        [authJwt.verifyToken],
        controller.getNewCompetition
    );

    app.all(
        "/competition/get-rank-competition",
        [authJwt.verifyToken],
        controller.getRankCompetitions
    );

    app.all(
        "/competition/get-quest-competition",
        [authJwt.verifyToken],
        controller.getQuestCompetitions
    );

    app.all(
        "/competition/get-competition-by-multi-filter",
        [authJwt.verifyToken],
        controller.getCompetitionByMultiFilter
    );

    app.all(
        "/diary/get-ranking/contest",
        [authJwt.verifyToken],
        controller.getCompetitionRanking
    );

};

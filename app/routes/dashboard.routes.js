const {authJwt} = require("../middleware");
const controller = require("../controllers/dashboard.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/user/total-count",
        [authJwt.verifyToken],
        controller.countUser
    );

    app.all(
        "/user/count-today",
        [authJwt.verifyToken],
        controller.countUserToday
    );

    app.all(
        "/user/get-top-level",
        [authJwt.verifyToken],
        controller.topLevelUsers
    );

};

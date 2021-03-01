const {authJwt} = require("../middleware");
const controller = require("../controllers/report.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/report/register",
        [authJwt.verifyToken],
        controller.registerReport
    );

    app.all(
        "/report/update",
        [authJwt.verifyToken],
        controller.updateReport
    );

    app.all(
        "/report/get-all",
        [authJwt.verifyToken],
        controller.getAllReports
    );

    app.all(
        "/report/get-by-id",
        [authJwt.verifyToken],
        controller.getReportById
    );

    app.all(
        "/report/get-by-user",
        [authJwt.verifyToken],
        controller.getReportByUser
    );

    app.all(
        "/report/get-by-reporter",
        [authJwt.verifyToken],
        controller.getReportByReporter
    );

    app.all(
        "/report/delete",
        [authJwt.verifyToken],
        controller.deleteReport
    );

    app.all(
        "/report/get-by-filter",
        [authJwt.verifyToken],
        controller.getReportByFilter
    );
};

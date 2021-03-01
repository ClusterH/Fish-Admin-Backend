const {authJwt} = require("../middleware");
const controller = require("../controllers/terms.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/terms/register",
        [authJwt.verifyToken],
        controller.registerTerms
    );

    app.all(
        "/terms/update",
        [authJwt.verifyToken],
        controller.updateTerms
    );

    app.all(
        "/terms/get-by-id",
        [authJwt.verifyToken],
        controller.getTermsById
    );

    app.all(
        "/terms/get-all",
        [authJwt.verifyToken],
        controller.getAllTerms
    );

    app.all(
        "/terms/delete",
        [authJwt.verifyToken],
        controller.deleteTerms
    );
};

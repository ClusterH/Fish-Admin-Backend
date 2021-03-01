const {authJwt} = require("../middleware");
const controller = require("../controllers/configuration.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/fish-type/register",
        [authJwt.verifyToken],
        controller.registerFishType
    );

    app.all(
        "/fish-type/update",
        [authJwt.verifyToken],
        controller.updateFishType
    );

    app.all(
        "/fish-type/get-all",
        [authJwt.verifyToken],
        controller.getAllFishTypes
    );

    app.all(
        "/fish-type/get-by-id",
        [authJwt.verifyToken],
        controller.getFishTypeById
    );

    app.all(
        "/fish-type/delete",
        [authJwt.verifyToken],
        controller.deleteFishType
    );

    app.all(
        "/banner/register",
        [authJwt.verifyToken],
        controller.registerBanner
    );

    app.all(
        "/banner/get-all",
        [authJwt.verifyToken],
        controller.getAllBanner
    );

    app.all(
        "/banner/delete",
        [authJwt.verifyToken],
        controller.deleteBanner
    );

};

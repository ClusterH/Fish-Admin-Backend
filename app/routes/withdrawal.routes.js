const {authJwt} = require("../middleware");
const controller = require("../controllers/withdrawal.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/withdrawal/apply",
        [authJwt.verifyToken],
        controller.applyWithdrawal
    );

    app.all(
        "/withdrawal/get-all",
        [authJwt.verifyToken],
        controller.getAllWithdrawal
    );

    app.all(
        "/withdrawal/get-by-id",
        [authJwt.verifyToken],
        controller.getWithdrawalById
    );

    app.all(
        "/withdrawal/get-by-user",
        [authJwt.verifyToken],
        controller.getWithdrawalByUser
    );

    app.all(
        "/withdrawal/finish",
        [authJwt.verifyToken],
        controller.finishWithdrawal
    );

    app.all(
        "/withdrawal/cancel",
        [authJwt.verifyToken],
        controller.cancelWithdrawal
    );

    app.all(
        "/withdrawal/account-type/register",
        [authJwt.verifyToken],
        controller.registerAccountType
    );

    app.all(
        "/withdrawal/account-type/get-all",
        [authJwt.verifyToken],
        controller.getAllAccountType,
    );

    app.all(
        "/withdrawal/account-type/delete",
        [authJwt.verifyToken],
        controller.deleteAccountType,
    );
};

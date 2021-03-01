const {authJwt} = require("../middleware");
const controller = require("../controllers/question.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/question/register",
        [authJwt.verifyToken],
        controller.registerQuestion
    );

    app.all(
        "/question/update",
        [authJwt.verifyToken],
        controller.updateQuestion
    );

    app.all(
        "/question/get-by-id",
        [authJwt.verifyToken],
        controller.getQuestionById
    );

    app.all(
        "/question/get-all",
        [authJwt.verifyToken],
        controller.getAllQuestion
    );

    app.all(
        "/question/delete",
        [authJwt.verifyToken],
        controller.deleteQuestion
    );

    app.all(
        "/question/register-answer",
        [authJwt.verifyToken],
        controller.registerAnswer
    );

    app.all(
        "/question/answer/register-comment",
        [authJwt.verifyToken],
        controller.addCommentToAnswer
    );

    app.all(
        "/question/get-by-filter",
        [authJwt.verifyToken],
        controller.getQuestionsByFilter
    );
};

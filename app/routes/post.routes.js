const {authJwt} = require("../middleware");
const controller = require("../controllers/post.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/post/register",
        [authJwt.verifyToken],
        controller.registerPost
    );

    app.all(
        "/post/update",
        [authJwt.verifyToken],
        controller.updatePost
    );

    app.all(
        "/post/get-all",
        [authJwt.verifyToken],
        controller.getAllPosts
    );

    app.all(
        "/post/delete",
        [authJwt.verifyToken],
        controller.deletePost
    );

    app.all(
        "/post/get-by-id",
        [authJwt.verifyToken],
        controller.getPostById
    );

    app.all(
        "/post/get-by-user",
        [authJwt.verifyToken],
        controller.getPostByUser
    );

    app.all(
        "/post/comment/register",
        [authJwt.verifyToken],
        controller.registerPostComment
    );

    app.all(
        "/post/comment/update",
        [authJwt.verifyToken],
        controller.updatePostComment
    );

    app.all(
        "/post/comment/get-by-post",
        [authJwt.verifyToken],
        controller.getPostCommentByPost
    );

    app.all(
        "/post/comment/delete",
        [authJwt.verifyToken],
        controller.deletePostComment
    );

    app.all(
        "/post/comment/reply/register",
        [authJwt.verifyToken],
        controller.registerPostCommentReply
    );

    app.all(
        "/post/comment/reply/update",
        [authJwt.verifyToken],
        controller.updatePostCommentReply
    );

    app.all(
        "/post/comment/reply/get-by-post",
        [authJwt.verifyToken],
        controller.getPostCommentReplyByPostComment
    );

    app.all(
        "/post/comment/reply/delete",
        [authJwt.verifyToken],
        controller.deletePostCommentReply
    );

    app.all(
        "/post/images/register",
        [authJwt.verifyToken],
        controller.registerPostImages
    );

    app.all(
        "/post/search",
        [authJwt.verifyToken],
        controller.searchPosts
    );
};

// const {authJwt} = require("../middleware");
// const controller = require("../controllers/diary.controller");
//
// module.exports = function (app) {
//     app.use(function (req, res, next) {
//         res.header(
//             "Access-Control-Allow-Headers",
//             "authorization, Origin, Content-Type, Accept"
//         );
//         next();
//     });
//
//     app.all(
//         "/diary/register",
//         [authJwt.verifyToken],
//         controller.registerDiary
//     );
//
//     app.all(
//         "/diary/get-by-user",
//         [authJwt.verifyToken],
//         controller.getDiariesByUser
//     );
//
//     app.all(
//         "/diary/get-ranking/contest",
//         [authJwt.verifyToken],
//         controller.getDiaryByCompetition
//     );
//
//     app.all(
//         "/diary/get-winners",
//         [authJwt.verifyToken],
//         controller.getWinners
//     );
//
//     app.all(
//         "/diary/update",
//         [authJwt.verifyToken],
//         controller.updateDiary
//     );
//
//     app.all(
//         "/diary/delete",
//         [authJwt.verifyToken],
//         controller.deleteDiaryById
//     );
//
//     app.all(
//         "/diary/add-comment",
//         [authJwt.verifyToken],
//         controller.addDiaryComment
//     );
//
//     app.all(
//         "/diary/search",
//         [authJwt.verifyToken],
//         controller.searchDiary
//     );
// };

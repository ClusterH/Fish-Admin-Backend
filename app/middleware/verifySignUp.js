const db = require("../models");
const User = db.user;
const LoginUser = db.loginUsers

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  LoginUser.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        msg: ["Failed! Username is already in use!"]
      });
      return;
    }

    // Email
    LoginUser.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          msg: ["Failed! Email is already in use!"]
        });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;

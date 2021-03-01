const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"] && req.headers["authorization"].split(' ')[1];
    if (!token) {
        return res.status(401).send({
            msg: ["No token provided!"]
        });
    }

    jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                msg: ["Unauthorized!"]
            });
        }
        req.user_id = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken,
};
module.exports = authJwt;

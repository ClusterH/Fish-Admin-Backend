const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Profile = db.profile;
const FishType = db.fishType;
const EmailVerification = db.emailVerification;
const EmailCertification = db.emailCertification;
const PhoneCertification = db.phoneVerification;
const validateRegisterInput = require("../validations/register.validation");
const validateLoginInput = require("../validations/login.validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/email");
const makeMailFromTemplate = require("../utils/email/mailTemplate");
const google = require("googleapis");
// import { google } from 'googleapis';

const generateToken = async (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email.toLowerCase(),
        createdAt: user.createdDate,
    };

    // Sign token
    return await jwt.sign(
        payload,
        config.SECRET_KEY,
        {
            expiresIn: 31556926 // 1 year in seconds
        },
    );
}

const generateCode = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const sendCode = async (user, res) => {
    const userId = user.id;
    const verifyCode = await generateCode(6);

    const data = {
        userId: userId,
        code: verifyCode,
        updatedDate: new Date(),
    }

    console.log('data: ', data)

    const info = await EmailVerification.findOne({
        where: {userId: userId}
    });

    if (info) {
        await EmailVerification.update(data, {
            where: {userId: userId}
        });
    } else {
        await EmailVerification.create(data);
    }

    sendMail(
        res,
        user.email,
        user.name,
        user.id,
        'You requested to reset your password.',
        makeMailFromTemplate({
            header: `안녕하세요, ${user.name}님`,
            title: '인증코드전송',
            content: '이메일인증을 위해 아래의 인증코드를 리용하세요.',
            value: verifyCode,
            extra: '',
        })
    );

}


/**
 * AdminUser Register
 * @param req keys: {name, email, password, confirmPassword, type}
 * @param res
 * @returns {token}
 */
exports.register = async (req, res) => {
    const {msg, isValid} = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json({msg: msg});
    }

    try {
        const user = await User.findOne({where: {email: req.body.email.toLowerCase()}});
        if (user) {
            return res.status(400).json({msg: "AUTH.VALIDATION.EMAIL_DUPLICATED"});
        }

        const newUser = {
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            type: req.body.type, // 0- 관리자, 1-일반유저, 2-구글로그인유저, 3-페이스북로그인유저
            createdDate: new Date(),
        };

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                User.create(newUser)
                    .then(async user => {
                        // await sendCode(user, res);
                        const device = req.body.device || '';
                        const token = await generateToken(user);
                        return res.status(200).json({accessToken: token, userInfo: user});
                    })
                    .catch(err => {
                        return res.status(500).json({msg: err.toString()});
                    });
            });
        });
    } catch (err) {
        return res.status(500).json({msg: err.toString()});
    }
};


/**
 * APP Login
 * @param req keys: {email, password}
 * @param res
 * @returns {token}
 */
exports.appLogin = async (req, res) => {
    Profile.hasOne(FishType, {sourceKey: 'mainFishType', foreignKey: 'id'});

    const {msg, isValid} = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json({msg: msg});
    }

    const device = req.body.device || '';

    try {
        const user = await User.findOne({
            where: {email: req.body.email.toLowerCase()},
            attributes: {
                exclude: ['password'],
            },
            include: [{
                model: Profile,
                include: [{
                    model: FishType
                }]
            }]
        });

        const generalInfo = await User.findOne({where: {email: req.body.email.toLowerCase()}});

        if (generalInfo) {
            bcrypt.compare(req.body.password, generalInfo.password).then(async isMatch => {
                if (isMatch) {
                    const token = await generateToken(generalInfo);
                    return res.status(200).json({accessToken: token, userInfo: user});
                } else {
                    return res.status(400).json({msg: "AUTH.VALIDATION.PASSWORD_WRONG"});
                }
            }).catch(err => res.status(500).json({msg: err.toString()}));
        } else {
            return res.status(404).json({msg: "AUTH.VALIDATION.EMAIL_NOT_FOUND"});
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};


/**
 * AdminUser Login
 * @param req keys: {name, email, type}
 * @param res
 * @returns {token}
 */
exports.socialLogin = async (req, res) => {
    console.log("socialLogin", req.body)
    try {
        let user = await User.findOne({
            where: {
                email: req.body.email,
            }
        });

        if (!user) {
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                type: req.body.type,
                createdDate: new Date()
            });
        }

        const token = await generateToken(user);
        return res.status(200).json({accessToken: token, userInfo: user});
    } catch (err) {
        return res.status(500).json(err);
    }
}

/**
 * AdminUser Login
 * @param req keys: {email, password}
 * @param res
 * @returns {token}
 */
exports.login = async (req, res) => {
    const {msg, isValid} = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json({msg: msg});
    }

    const device = req.body.device || '';

    try {
        const user = await User.findOne({where: {email: req.body.email.toLowerCase()}});

        if (user) {
            bcrypt.compare(req.body.password, user.password).then(async isMatch => {
                if (isMatch) {
                    const token = await generateToken(user);
                    return res.status(200).json({accessToken: token});
                } else {
                    return res.status(400).json({msg: "AUTH.VALIDATION.PASSWORD_WRONG"});
                }
            }).catch(err => res.status(500).json({msg: err.toString()}));
        } else {
            return res.status(404).json({msg: "AUTH.VALIDATION.EMAIL_NOT_FOUND"});
        }
    } catch (err) {
        return res.status(400).json(err);
    }
};

/**
 * Sending a verification code for email verification
 * @param req keys: {email}
 * @param res
 */
exports.forgotPassword = (req, res) => {
    User.findOne({
        where: {email: req.body.email.toLowerCase()}
    }).then(async (user) => {
        if (!user) {
            return res.status(404).send({msg: "AUTH.VALIDATION.EMAIL_NOT_FOUND"});
        }
        await sendCode(user, res);
    }).catch(err => {
        return res.status(500).send({message: err.message});
    });
};

/**
 * Verify the verification code
 * @param req keys: {userId, code}
 * @param res
 * @returns {Promise<void>}
 */
exports.verifyCode = async (req, res) => {
    try {
        const now = new Date();
        const info = await EmailVerification.findOne({
            where: {userId: req.body.userId}
        });

        if (req.body.code === '') {
            return res.status(400).send({msg: 'AUTH.VALIDATION.REQUIRED_CODE'});
        } else if (now - info.updatedDate > config.PENDING_EXPIRATION) {
            return res.status(400).send({msg: 'AUTH.VERIFY_CODE_EXPIRED'});
        } else if (info.code !== req.body.code) {
            return res.status(400).send({msg: 'AUTH.VERIFY_CODE_INCORRECT'});
        } else {
            return res.status(200).send({result: 'AUTH.VERIFY_CODE_SUCCESS'});
        }
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
};

exports.verifyCodeAndSignUp = async (req, res) => {
    console.log('userAId: ', req.body.userId)
    try {
        const now = new Date();
        const info = await EmailVerification.findOne({
            where: {userId: req.body.userId}
        });

        if (req.body.code === '') {
            return res.status(400).send({msg: 'AUTH.VALIDATION.REQUIRED_CODE'});
        } else if (now - info.updatedDate > config.PENDING_EXPIRATION) {
            return res.status(400).send({msg: 'AUTH.VERIFY_CODE_EXPIRED'});
        } else if (info.code !== req.body.code) {
            return res.status(400).send({msg: 'AUTH.VERIFY_CODE_INCORRECT'});
        } else {
            const user = await User.findOne({
                where: {
                    id: req.body.userId,
                }
            });

            await user.save();

            const token = await generateToken(user);

            return res.status(200).send({result: 'AUTH.VERIFY_CODE_SUCCESS', accessToken: token});
        }
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}


/**
 * Change password
 * @param req keys: {email, newPassword}
 * @param res
 * @returns {Promise<any>}
 */
exports.changePassword = async (req, res) => {
    const newPassword = req.body.newPassword;

    try {
        const user = await User.findOne({
            where: {email: req.body.email.toLowerCase()}
        });

        if (!user) {
            return res.status(404).send({msg: 'AUTH.VALIDATION.EMAIL_NOT_FOUND'});
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user.updatedDate = new Date();
                    user.save();
                    return res.status(200).send({msg_reset: 'AUTH.RESET_PASSWORD_SUCCESS'});
                });
            });
        }
    } catch (err) {
        return res.status(500).send({msg: err.message});
    }
}

/**
 * Check if the email was used
 * @param req keys: {email}
 * @param res
 */
exports.checkEmail = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email.toLowerCase()
        }
    }).then(user => {
        const result = user ? 'USED_EMAIL' : 'UNUSED_EMAIL';
        return res.status(200).send({result});
    }).catch(err => {
        return res.status(500).send({msg: err.message});
    })
}

/**
 * Get adminUser Info by userId
 * @param req keys: {userId}
 * @param res
 */
exports.getUserInfo = (req, res) => {
    User.findOne({
        where: {id: req.body.userId},
        attributes: {exclude: 'password'}
    })
        .then(user => {
            return res.status(200).json({result: user});
        })
        .catch(err => {
            return res.status(400).json({msg: err.toString()});
        });
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.verifyEmail = async (req, res) => {
    const email = req.body.email.toLowerCase();
    const userId = req.body.userId;
    const code = await generateCode(6);

    const data = {
        userId: userId,
        email: email,
        code: code,
        updatedDate: new Date(),
    }

    const info = await EmailCertification.findOne({
        where: {email: email}
    });

    if (info) {
        info.userId = userId;
        info.code = code;
        info.updatedDate = new Date();
        await info.save();
    } else {
        await EmailCertification.create(data);
    }

    sendMail(
        res,
        email,
        '',
        userId,
        'Email Certification',
        makeMailFromTemplate({
            header: `안녕하세요.`,
            title: '인증코드전송',
            content: '이메일인증을 위해 아래의 인증코드를 리용하세요.',
            value: code,
            extra: '',
        })
    );
}

/**
 * Email Verification for Withdrawal
 * @param req keys: {userId, email, code}
 * @param res
 * @returns {Promise<*>}
 */
exports.verifyCodeForEmail = async (req, res) => {
    try {
        const now = new Date();
        const info = await EmailCertification.findOne({
            where: {email: req.body.email.toLowerCase()}
        });

        if (req.body.code === '') {
            return res.status(400).send({msg: 'AUTH.VALIDATION.REQUIRED_CODE'});
        } else if (now - info.updatedDate > config.PENDING_EXPIRATION) {
            return res.status(400).send({msg: 'AUTH.VERIFY_CODE_EXPIRED'});
        } else if (info.code !== req.body.code) {
            return res.status(400).send({msg: 'AUTH.VERIFY_CODE_INCORRECT'});
        } else {
            console.log('userId: ', info.userId)
            const profile = await Profile.findOne({
                where: {userId: info.userId}
            });
            profile.withdrawEmail = req.body.email;
            profile.updatedDate = new Date();
            await profile.save();
            return res.status(200).send({result: 'AUTH.VERIFY_CODE_SUCCESS', data: profile});
        }
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
};

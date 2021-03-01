const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data){
    let msg = '';

    try {
        if(Validator.isEmpty(data.email)){
            msg = "AUTH.VALIDATION.REQUIRED_EMAIL";
        } else if(!Validator.isEmail(data.email)){
            msg = "AUTH.VALIDATION.WRONG_EMAIL";
        } else if(Validator.isEmpty(data.password)){
            msg = "AUTH.VALIDATION.REQUIRED_PASSWORD";
        }

        return {
            msg: msg,
            isValid: msg === ''
        };
    } catch (e) {
        return  e;
    }
};

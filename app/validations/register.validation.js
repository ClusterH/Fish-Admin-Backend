const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data){
	let msg = '';

	if(Validator.isEmpty(data.name)){
		msg = "AUTH.VALIDATION.REQUIRED_NAME";
	} else if(Validator.isEmpty(data.email)){
		msg = "AUTH.VALIDATION.REQUIRED_EMAIL";
	} else if(!Validator.isEmail(data.email)){
		msg = "AUTH.VALIDATION.WRONG_EMAIL";
	} else if(Validator.isEmpty(data.password)){
		msg = "AUTH.VALIDATION.REQUIRED_PASSWORD";
	} else if(Validator.isEmpty(data.confirmPassword)){
		msg = "AUTH.VALIDATION.REQUIRED_CONFIRM_PASSWORD";
	} else if(!Validator.isLength(data.password, {min: 6, max: 30})){
		msg = "AUTH.VALIDATION.MIN_PASSWORD_LENGTH";
	} else if(!Validator.equals(data.password, data.confirmPassword)){
		msg = "AUTH.VALIDATION.PASSWORD_NOT_MATCH";
	}

	return {
		msg: msg,
		isValid: msg === '',
	};
};

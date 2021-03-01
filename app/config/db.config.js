module.exports = {
	HOST: "54.180.210.166",
	USER: "fishing_user",
	PASSWORD: "20191129aA!",
	DB: "fishing_db",
	dialect: "mysql",
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
};

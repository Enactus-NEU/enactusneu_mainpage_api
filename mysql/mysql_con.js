const mysql = require("mysql")

const mysqlCon = mysql.createConnection({
	host    : process.env.DATABASE_HOST,
	user    : process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_USEDDATABASE
});

module.exports = mysqlCon
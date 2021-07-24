const express = require('express');
const app = express();

require('dotenv').config()
// const mysql = require("mysql")

// const mysqlCon = mysql.createConnection({
// 	host    : process.env.DATABASE_HOST,
// 	user    : process.env.DATABASE_USER,
// 	password: process.env.DATABASE_PASS,
// 	database: process.env.DATABASE_USEDDATABASE
// });

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
	// mysqlCon.connect(function(err) {
	// 	if (err) throw err;
		res.send("Connected!")
	// });
})

app.listen(port, () => {
	console.log(`App are listening on port ${port}`)
})
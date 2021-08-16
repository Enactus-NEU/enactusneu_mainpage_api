//import express
const express = require("express")
const router = express.Router()

//import npm package
const jwt = require("jsonwebtoken")
const md5 = require("md5")

//mysql
const con = require("../mysql/mysql_con")

router.post('/', function(req, res) {
    const email = req.body.email
    const password = req.body.password
    con.query(`SELECT * FROM admin WHERE email="${md5(email)}" AND password="${md5(password)}"`, function(err, result) {
        
        if (err) return res.status(500).json({ message: err })
        else if (result && result.length === 0) return res.sendStatus(401)

        //create JWT
        const accessToken = jwt.sign({ id: result[0].id, email: result[0].email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "12h"
        })
        res.json({ accessToken, email })
    })
})

module.exports = router
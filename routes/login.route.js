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
        
        if (err) {
            res.status(500).json({ message: err })
            return;
        }
        
        if (result.length === 0) {
            //xem co dung mail khong
            con.query(`SELECT * FROM admin WHERE email="${md5(email)}"`, function(err, result) {
                if (result.length !== 0 && result[0].fail_count < 10) {
                    newCount = result[0].fail_count + 1
                    con.query(`UPDATE admin SET fail_count=${newCount} WHERE id=${result[0].id}`)
                }
            })
            return res.status(401).json({ message: "Sai email hoặc password" });
        } 
        
        if (result[0].fail_count > 10) {
            return res.status(401).json({ message: "Tài khoản đã bị khóa" })
        } else {
            //create JWT
            const accessToken = jwt.sign({ id: result[0].id, email: result[0].email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "12h"
            })
            res.json({ accessToken, email })
        }
    })
})

module.exports = router
const express = require('express');
const router = express.Router();

//mysql
const con = require("../mysql/mysql_con")

//get all
router.get('/', (req, res) => {
    let sql = `SELECT * FROM count`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })
		
        res.json(result)
	})
})


//getting one
router.get('/:id', (req, res) => {

    let sql = `SELECT * FROM count WHERE count.id=${req.params.id}`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })
		
        else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find" })
        
        res.json(result)
	})
})

//creating one
router.post('/', (req, res) => {
    // Mau Object de gui post
    // {
    //     "des": "post",
    //     "count": "bbbaaaaaa"
    // }
    let sql = `INSERT INTO count SET ?`
	con.query(sql, req.body, function(err, result) {
		
        if (err) return res.status(400).json({ message: err })
        
        con.query(`SELECT * FROM count WHERE id=${result.insertId}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            res.status(201).json(result)
        })
	})
})

//updating one
router.patch("/:id", function(req, res) {

    let sql = `UPDATE count SET ? WHERE id=${req.params.id}`
    con.query(sql, req.body, function(err, result) {
        
        if (err) return res.status(400).json({ message: err })

        con.query(`SELECT * FROM count WHERE id=${req.params.id}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find" })

            res.status(201).json(result)
        })
    })
})


// deleting one
router.delete('/:id', function(req, res) {
    let sql = `DELETE FROM count WHERE id=${req.params.id}`
    con.query(sql, function(err, result) {

        if (err) return res.status(500).json({ message: err })
		
        res.json({ message: "Deleted" })
    })
})


module.exports = router;
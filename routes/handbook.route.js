const express = require('express');
const router = express.Router();

//mysql
const con = require("../mysql/mysql_con")

//get all
router.get('/', (req, res) => {
    let sql = `SELECT * FROM handbook`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })
		
        res.json(result)
	})
})


//getting one
router.get('/:id', (req, res) => {

    let sql = `SELECT * FROM handbook WHERE handbook.id=${req.params.id}`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })
		
        else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the handbook" })
        
        res.json(result)
	})
})

//creating one
router.post('/', (req, res) => {
    // Mau Object de gui post
    // {
    //     "img_url": "post",
    //     "name": "bbbaaaaaa",
    //     "src_url": "url123",
    // }
    let sql = `INSERT INTO handbook SET ?`
	con.query(sql, req.body, function(err, result) {
		
        if (err) return res.status(400).json({ message: err })
        
        con.query(`SELECT * FROM handbook WHERE id=${result.insertId}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            res.status(201).json(result)
        })
	})
})

//updating one
router.patch("/:id", function(req, res) {

    let sql = `UPDATE handbook SET ? WHERE id=${req.params.id}`
    con.query(sql, req.body, function(err, result) {
        
        if (err) return res.status(400).json({ message: err })

        con.query(`SELECT * FROM handbook WHERE id=${req.params.id}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the handbook" })

            res.status(201).json(result)
        })
    })
})


// deleting one
router.delete('/:id', function(req, res) {
    let sql = `DELETE FROM handbook WHERE id=${req.params.id}`
    con.query(sql, function(err, result) {

        if (err) return res.status(500).json({ message: err })
		
        res.json({ message: "Deleted" })
    })
})


module.exports = router;
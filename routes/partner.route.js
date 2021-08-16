const express = require('express');
const router = express.Router();

//mysql
const con = require("../mysql/mysql_con")

//get all
router.get('/', (req, res) => {
    let sql = `SELECT * FROM partner`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })

        //sort
        const sort = JSON.parse(req.query.sort)
        if (sort[0] === "id") {
            result.sort((a, b) => {
                if (sort[1] === "ASC") {
                    return a.id - b.id
                } else if (sort[1] === "DESC") {
                    return b.id - a.id
                }
            })
        } else {
            result.sort((a, b) => {
                if (sort[1] === "ASC") {
                    return a[sort[0]].charCodeAt(0) - b[sort[0]].charCodeAt(0)
                } else if (sort[1] === "DESC") {
                    return b[sort[0]].charCodeAt(0) - a[sort[0]].charCodeAt(0)
                }
            })
        }

        res.setHeader("Content-Range", `news 0-${result.length}/${result.length}`)
        //pagination
        const range = JSON.parse(req.query.range)
        res.status(200).json(result.slice(range[0], range[1]))
	})
})


//getting one
router.get('/:id', (req, res) => {

    let sql = `SELECT * FROM partner WHERE partner.id=${req.params.id}`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })
		
        else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the partner" })
        
        res.json(result[0])
	})
})

//creating one
router.post('/', (req, res) => {
    // Mau Object de gui post
    // {
    //     "img_url": "bbbaaaaaa"
    // }
    let sql = `INSERT INTO partner SET ?`
	con.query(sql, req.body, function(err, result) {
		
        if (err) return res.status(400).json({ message: err })
        
        con.query(`SELECT * FROM partner WHERE id=${result.insertId}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            res.status(201).json(result[0])
        })
	})
})

//updating one
router.put("/:id", function(req, res) {

    let sql = `UPDATE partner SET ? WHERE id=${req.params.id}`
    con.query(sql, req.body, function(err, result) {
        
        if (err) return res.status(400).json({ message: err })

        con.query(`SELECT * FROM partner WHERE id=${req.params.id}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the partner" })

            res.status(201).json(result[0])
        })
    })
})


// deleting one
router.delete('/:id', function(req, res) {
    let sql = `DELETE FROM partner WHERE id=${req.params.id}`
    con.query(sql, function(err, result) {

        if (err) return res.status(500).json({ message: err })
		
        res.json({ message: "Deleted" })
    })
})


module.exports = router;
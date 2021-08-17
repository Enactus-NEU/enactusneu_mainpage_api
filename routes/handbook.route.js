const express = require('express');
const router = express.Router();

//mysql
const con = require("../mysql/mysql_con")

//get all
router.get('/', (req, res) => {
    let sql = `SELECT * FROM handbook`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })

        if (Object.keys(req.query).length > 0) {

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
    
            //pagination
            const range = JSON.parse(req.query.range)
            res.setHeader("Content-Range", `news 0-${result.length}/${result.length}`)
            res.status(200).json(result.slice(range[0], range[1]))
        } else {
            res.json(result)
        }

	})
})


//getting one
router.get('/:id', (req, res) => {

    let sql = `SELECT * FROM handbook WHERE handbook.id=${req.params.id}`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })
		
        else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the handbook" })
        
        res.json(result[0])
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
            
            res.status(201).json(result[0])
        })
	})
})

//updating one
router.put("/:id", function(req, res) {

    let sql = `UPDATE handbook SET ? WHERE id=${req.params.id}`
    con.query(sql, req.body, function(err, result) {
        
        if (err) return res.status(400).json({ message: err })

        con.query(`SELECT * FROM handbook WHERE id=${req.params.id}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the handbook" })

            res.status(201).json(result[0])
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
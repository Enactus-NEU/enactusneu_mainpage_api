const express = require('express');
const router = express.Router();

//mysql
const con = require("../mysql/mysql_con")

//get all
router.get('/', (req, res) => {
    let sql = `SELECT category_id as id, category_name FROM category`
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
            res.json(result.slice(range[0], range[1]))
        } else {
            res.setHeader("Content-Range", `news 0-${result.length}/${result.length}`)
            res.json(result)
        }
	})
})


//getting one
router.get('/:id', (req, res) => {

    let sql = `SELECT category_id as id, category_name FROM category WHERE category.category_id=${req.params.id}`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })
		
        else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the category" })
        
        res.json(result[0])
	})
})

//creating one
router.post('/', (req, res) => {
    // Mau Object de gui post
    // {
    //     "name": "bbbaaaaaa"
    // }
    let sql = `INSERT INTO category SET ?`
	con.query(sql, req.body, function(err, result) {
		
        if (err) return res.status(400).json({ message: err })
        
        con.query(`SELECT category_id as id, category_name FROM category WHERE category_id=${result.insertId}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            res.status(201).json(result[0])
        })
	})
})

//updating one
router.put("/:id", function(req, res) {

    let sql = `UPDATE category SET category_name='${req.body.category_name}' WHERE category_id=${req.params.id}`
    con.query(sql, function(err, result) {
        
        if (err) return res.status(400).json({ message: err })

        con.query(`SELECT category_id as id, category_name FROM category WHERE category_id=${req.params.id}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the category" })

            res.status(201).json(result[0])
        })
    })
})


// deleting one
router.delete('/:id', function(req, res) {
    let sql = `DELETE FROM category WHERE category_id=${req.params.id}`
    con.query(sql, function(err, result) {

        if (err) return res.status(500).json({ message: err })
		
        res.json({ message: "Deleted" })
    })
})


module.exports = router;
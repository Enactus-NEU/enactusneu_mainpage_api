const express = require('express');
const router = express.Router();

//mysql
const con = require("../mysql/mysql_con")

//get all
router.get('/', (req, res, next) => {
    let sql = `SELECT * FROM news, category WHERE news.category_id = category.category_id`
	con.query(sql, function(err, result) {
        
        if (err) return res.status(500).json({ message: err })

        // let searchData = result.filter((item) => {
            //     return item.title.toLowerCase.includes(req.query.filter.q.toLowerCase)
            // })
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

            //filter
            const filter = JSON.parse(req.query.filter)
            
            if (filter.title !== undefined) {
                result = result.filter(item => {
                    return item.title.toLowerCase().includes(filter.title.toLowerCase())
                })
            }
            if (filter.category_name !== undefined) {
                result = result.filter(item => {
                    return item.category_name.toLowerCase().includes(filter.category_name.toLowerCase())
                })
            }

            res.setHeader("Content-Range", `news 0-${result.length}/${result.length}`)

            //pagination
            const range = JSON.parse(req.query.range)
            res.status(200).json(result.slice(range[0], range[1]))
        } else {
            res.status(200).json(result)
        }
	})
})

router.get("/short-name", function(req, res) {
    let sql = `SELECT DISTINCT id, short_name, avatar, cover, des, is_main FROM news WHERE category_id=${req.query.category_id || true} AND short_name IS NOT NULL AND is_main = 1 ORDER BY id`
    con.query(sql, function(err, result) {
        if (err) return res.status(500).json({ message: err })
        
        res.json(result)
    })

})

//getting one
router.get('/:id', (req, res) => {

    let sql = `SELECT * FROM news WHERE news.id=${req.params.id}`
	con.query(sql, function(err, result) {
		
        if (err) return res.status(500).json({ message: err })
		
        else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the news" })
        
        res.json(result[0])
        //     title: result[0].title,
        //     content: result[0].content,
        //     avatar: result[0].avatar,
        //     cover: result[0].cover,
        //     category_id: result[0].category_id,
        //     created_time: result[0].created_time
        // })
	})
})

//creating one
router.post('/', (req, res) => {
    // Mau Object de gui post
    // {
    //     "title": "post",
    //     "content": "bbbaaaaaa",
    //     "avatar": "url123",
    //     "cover": "url2123",
    //     "category_id": 1
    // }
    let sql = `INSERT INTO news SET ?`
	con.query(sql, req.body, function(err, result) {
		
        if (err) return res.status(400).json({ message: err })
        
        con.query(`SELECT * FROM news WHERE id=${result.insertId}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            res.status(201).json(result[0])
        })
	})
})

//updating one
router.put("/:id", function(req, res) {
    delete req.body.created_time
    let sql = `UPDATE news SET ? WHERE id=${req.params.id}`
    con.query(sql, req.body, function(err, result) {
        
        if (err) return res.status(400).json({ message: err })

        con.query(`SELECT * FROM news WHERE id=${req.params.id}`, function(err, result) {
            if (err) return res.status(500).json({ message: err })
            
            else if (result && result.length === 0) return res.status(404).json({ message: "Cannot find the news" })

            res.status(201).json(result[0])
        })
    })
})


// deleting one
router.delete('/:id', function(req, res) {
    let sql = `DELETE FROM news WHERE id=${req.params.id}`
    con.query(sql, function(err, result) {

        if (err) return res.status(500).json({ message: err })
		
        res.json({ message: "Deleted" })
    })
})


module.exports = router;
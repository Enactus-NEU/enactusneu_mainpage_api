const express = require('express');
const app = express();


//npm-package
require("dotenv").config()
const cors = require('cors')


const port = process.env.PORT;

//CORS
app.use(cors({
    origin: "*",
    allowedHeaders: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: "Content-Range"
}))
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST , PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', '*');

//     res.setHeader('Access-Control-Expose-Headers', '*');

//     // Pass to next layer of middleware
//     next();
// });

// auth
const verifyAdmin = require("./middleware/auth")
app.all("*", verifyAdmin)

//import router
const loginRoutes = require("./routes/login.route")
const newsRoutes = require("./routes/news.route")
const partnerRoutes = require("./routes/partner.route")
const handbookRoutes = require("./routes/handbook.route")
const countRoutes = require("./routes/count.route")
const categoryRoutes = require("./routes/category.route")
const bomRoutes = require("./routes/bom.route")
const adviserRoutes = require("./routes/adviser.route")

//use router
app.use(express.json()) // for parsing application/json

app.use('/login', loginRoutes)

app.use('/news', newsRoutes)
app.use('/partner', partnerRoutes)
app.use('/handbook', handbookRoutes)
app.use('/count', countRoutes)
app.use('/category', categoryRoutes)
app.use('/bom', bomRoutes)
app.use('/adviser', adviserRoutes)


app.get('/', (req, res) => {
	res.send("Enactus NEU")
})

app.listen(port, () => {
	console.log(`App are listening on port ${port}`)
})
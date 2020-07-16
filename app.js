const express = require('express')
const app = express()
const path = require('path')
const apiRouter = require('./routes/Router')
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use('/', apiRouter)

app.use(express.static(__dirname + '/public'))

app.set('views', path.resolve(__dirname + "/views"))
app.set('view engine', 'ejs')

const PORT = 8080
app.listen(PORT, (req, res) => {
    console.log(`Running on http://localhost:${PORT}`)
})
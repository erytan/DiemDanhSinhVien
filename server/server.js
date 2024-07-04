const express = require('express')
require('dotenv').config()
const dbconnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express()
const port = process.env.PORT || 8000
app.use(cookieParser())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*'
}));

dbconnect()
initRoutes(app)

app.listen(port, () => {
    console.log('Hehehe cố gắng lên ');
})
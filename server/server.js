const express = require('express')
require('dotenv').config()



const app = express()
const port = process.env.PORT || 8000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', (req, res) => {
    res.send("test")
})
app.listen(port, () => {
    console.log('tesstt : ' + port);
})

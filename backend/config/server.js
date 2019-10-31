const bodyParser = require('body-parser')
const express = require('express')
const allowCors = require('./cors')
const queryParser = require('express-query-int')

const port = 3003
const server = express()

// Middleware to parse request information into JSON data
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

// Maintain Cross-origin resource sharing
server.use(allowCors)

// Integer values conversion for request parameters
server.use(queryParser())

server.listen(port, function() {
    console.log(`Billing Cycle backend is running on port ${port}.`)
})

module.exports = server
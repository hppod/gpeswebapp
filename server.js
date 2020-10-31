const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(__dirname + '/dist/gpesweb-app/'))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000.com/')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)

    next()
})

app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] != 'https') {
        res.redirect('http://' + req.headers.host + req.url)
    } else {
        res.sendFile(path.join(__dirname + '/dist/gpesweb-app/index.html'))
    }
})

app.listen(process.env.PORT || 8080)
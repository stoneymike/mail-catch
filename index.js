const fetch = require("node-fetch")
const express = require("express")
const { lookup } = require('geoip-lite')
const expressip = require('express-ip')

const app = express()

app.set('trust proxy', true)

app.use(express.json())
app.use(expressip().getIpInfoMiddleware)

const port = 3000 || process.env.PORT

app.get('/', async (req, res) => {
  console.log(req.ipInfo)

  console.log(lookup(req.ipInfo.ip))

  res.send("ERROR")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
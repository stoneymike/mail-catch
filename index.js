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
  var fetch_res = await fetch(`https://ipapi.co/${req.ip}/json/`);
  var fetch_data = await fetch_res.json()

  res.send(fetch_data)

  const ip = req.headers['x-real-ip'] || req.socket.remoteAddress 

  console.log(req.ipInfo)

  console.log(lookup(req.ips))

  console.log(`You are from ${fetch_data.region}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
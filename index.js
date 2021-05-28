const fetch = require('node-fetch')
const {UM} = require('./um-wwa/um')
const server = require('./server')
require('dotenv').config()

server()

console.log("############")

const ztm = new UM(process.env.TOKEN)

ztm.getQRCode(10002, 0)


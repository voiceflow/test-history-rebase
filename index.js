#!/usr/bin/env node
const fs = require('fs')

if(process.env.NODE_ENV && fs.existsSync(`./.env.${process.env.NODE_ENV}`)){
  if (process.env.NODE_ENV !== 'test') console.log(`Running in ${process.env.NODE_ENV} environment`)
  require('dotenv').config({path:`./.env.${process.env.NODE_ENV}`})
}else if(fs.existsSync(`./.env`)){
  console.log(`No Environment Set/Not Found! Running default .env file`)
  require('dotenv').config()
}else{
  console.log(`No Environment Set/Not Found! Hope you have your environment declared :O`)
}

const app = require('./app')
const npmPackage = require('./package.json')

const name = npmPackage.name+' v'+npmPackage.version
const port = 8080

// eslint-disable-next-line no-console
if (process.env.NODE_ENV === 'test') {
    console.log('INTEGRATION TESTS')
    app.listen(port, () => console.log(`TESTING ${name} | PORT ${port}`))
}else{
    const io = require('socket.io')(app.listen(port, () => console.log(`${name} | PORT ${port}`)), {
      pingInterval: 5000,
      pingTimeout: 10000
    })
    const redisAdapter = require('socket.io-redis')
    io.adapter(redisAdapter({ host: process.env.REDIS_CLUSTER_HOST, port: process.env.REDIS_CLUSTER_PORT }))
    require('./sockets')(io)
}
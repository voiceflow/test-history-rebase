#!/usr/bin/env node
const app = require('./app')
const npmPackage = require('./package.json')

const name = npmPackage.name+' v'+npmPackage.version

const port = 8080

// eslint-disable-next-line no-console
if (process.env.NODE_ENV === 'test') {
    app.listen(port, () => console.log(`${name} | PORT ${port}`))
}else{
    const io = require('socket.io')(app.listen(port, () => console.log(`${name} | PORT ${port}`)), {
        pingInterval: 10000,
        pingTimeout: 20000
    })
    const redisAdapter = require('socket.io-redis')
    io.adapter(redisAdapter({ host: process.env.REDIS_CLUSTER_HOST, port: process.env.REDIS_CLUSTER_PORT }))
    require('./sockets')(io)
}
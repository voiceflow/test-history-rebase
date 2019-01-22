#!/usr/bin/env node
const app = require('./app')
const npmPackage = require('./package.json')

const port = 8080
const name = npmPackage.name+' v'+npmPackage.version

const { getEnvVariable } = require('./util')

// eslint-disable-next-line no-console
if (process.env.NODE_ENV !== 'test') {
    const io = require('socket.io')(app.listen(port, () => console.log(`${name} | PORT ${port}`)), {
        pingInterval: 15000,
        pingTimeout: 30000
    })
    const redisAdapter = require('socket.io-redis')
    io.adapter(redisAdapter({ host: getEnvVariable('REDIS_CLUSTER_HOST'), port: getEnvVariable('REDIS_CLUSTER_PORT') }))
    require('./sockets')(io)
}else{
    app.listen(port, () => console.log(`${name} | PORT ${port}`))
}
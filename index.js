#!/usr/bin/env node

const app = require('./app')
const npmPackage = require('./package.json')

const port = 8080
const name = npmPackage.name+' v'+npmPackage.version

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`${name} | PORT ${port}`))
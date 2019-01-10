#!/usr/bin/env node

const app = require('./app');
const fs = require('fs');
const https = require('https');
const npmPackage = require('./package.json');

const port = 8080;
const name = npmPackage.name+' v'+npmPackage.version;

// eslint-disable-next-line no-console
if(process.env.SECURE){
    var options = {
        key: fs.readFileSync('config/server.key'),
        cert: fs.readFileSync('config/server.crt'),
    };
    https.createServer(options, app).listen(443);
}else{
    app.listen(port, () => console.log(name + ' running on port ' + port));
}

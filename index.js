#!/usr/bin/env node

const npmPackage = require('./package.json');

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-config.json');

const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'com.getstoryflow.audio.production',
        key: (req, file, cb) => {
            cb(null, Date.now().toString()+'-'+file.originalname
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-.]+/g, ''));
        }
    })
});

const Diagram = require('./diagram.js');
const Error = require('./error.js');
const Audio = require('./audio.js');

const port = 8080;
const name = npmPackage.name+' v'+npmPackage.version;

passport.use(new LocalStrategy((username, password, cb) => {
    let email = username.trim().toLowerCase();
    let params = {
        TableName: 'com.getstoryflow.users.production',
        Key: {'email': email}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data.Item) {
            bcrypt.compare(password, data.Item.password, (err, res) => {
                if (res) {
                    cb(null, data.Item);
                } else {
                    cb(null, false);
                }
            });
        } else {
            cb(null, false);
        }
    });
}));

passport.serializeUser((user, cb) => {
    cb(null, user.email);
});

passport.deserializeUser((email, cb) => {
    let params = {
        TableName: 'com.getstoryflow.users.production',
        Key: {'email': email}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
            cb(null, false);
        } else if (data.Item) {
            cb(null, data.Item);
        }
    });
});

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(session({
    name: 'storyflow-session',
    secret: 'st0ryfl0w!'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/admin', [
    ensureLoggedIn(),
    express.static(path.join(__dirname, 'admin'))
]);
app.use('/creator', [
    ensureLoggedIn(),
    express.static(path.join(__dirname, 'creator'))
]);

app.get('/', (req, res) => res.redirect('/creator'));

app.get('/diagrams', ensureLoggedIn(), Diagram.getDiagrams);
app.get('/diagrams/:id', ensureLoggedIn(), Diagram.getDiagram);
app.post('/diagrams', ensureLoggedIn(), Diagram.setDiagram);
app.post('/publish/:env/:id', ensureLoggedIn(), Diagram.publish);

app.get('/errors/:env', ensureLoggedIn(), Error.getErrors);

app.get('/voices', ensureLoggedIn(), Audio.getVoices);
app.post('/generate', ensureLoggedIn(), Audio.generate);
app.post('/audio', ensureLoggedIn(), upload.any(), Audio.upload);

app.get('/register', (req, res) => {
    res.redirect('https://getstoryflow.com/signup');
});
app.get('/login', (req, res) => {
    res.redirect('https://getstoryflow.com/login');
});
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});
app.get('/me', (req, res) => {
    res.send(req.user ? req.user.email : null);
});
app.post('/register', ensureLoggedOut(), (req, res) => {
    let name = req.body.name;
    let email = req.body.username.trim().toLowerCase();
    let password = req.body.password;
    let confirmPassword = req.body.confirmpassword;
    let code = req.body.code;

    if (!name || !email || !password || !confirmPassword || password !== confirmPassword || code !== 'B5FWPZTF') {
        res.redirect('/register');

        return;
    }

    let params = {
        TableName: 'com.getstoryflow.users.production',
        Key: {'email': email}
    };
    docClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else if (data.Item) {
            res.redirect('/register');
        } else {
            let hash = bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.log(err);
                    res.redirect('/register');
                } else {
                    let params = {
                        TableName: 'com.getstoryflow.users.production',
                        Item: {
                            email: email,
                            password: hash,
                            id: uuidv1(),
                            name: name,
                            createdAt: new Date().toISOString()
                        }
                    };
                    docClient.put(params, err => {
                        if (err) {
                            console.log(err);
                            res.redirect('/register');
                        } else {
                            res.redirect('/login');
                        }
                    });
                }
            });
        }
    });
});
app.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    faliureRedirect: '/login'
}));

// eslint-disable-next-line no-console
app.listen(port, () => console.log(name + ' running on port ' + port));

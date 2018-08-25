const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const AWS = require('aws-sdk');
const randomstring = require("randomstring");

ffmpeg.setFfmpegPath(ffmpegPath);

AWS.config.loadFromPath('./aws-config.json');

const s3 = new AWS.S3();
const polly = new AWS.Polly();

const s3Stream = require('s3-upload-stream')(s3);

const rimraf = dir_path => {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            let entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
};

const convert = (key, env = 'production') => {
    let params = {
        Bucket: 'com.getstoryflow.audio.'+env,
        Key: key
    };

    let upload = s3Stream.upload(params);
    upload.maxPartSize(20971520);
    upload.concurrentParts(5);
    upload.on('error', err => {
        console.log(err);
    });

    ffmpeg()
        .format('mp3')
        .input(s3.getObject(params).createReadStream())
        .audioChannels(2)
        .audioCodec('libmp3lame')
        .audioBitrate('48k')
        .audioFrequency(16000)
        .pipe(upload);
};

const updateTitles = (stories, env) => {
    let dir = path.join(__dirname, 'tmp', Date.now().toString());
    fs.existsSync(dir) || fs.mkdirSync(dir);

    let files = [];
    let count = 0;
    stories.forEach(story => {
        if (!story.preview) {
            count++;

            return;
        }
        let key = path.basename(story.preview);
        let file = fs.createWriteStream(path.join(dir, key));
        files.push(path.join(dir, key));
        let params = {
            Bucket: 'com.getstoryflow.audio.production',
            Key: key
        };
        s3.getObject(params, (err, data) => {
            if (err) {
                console.log(err);

                return;
            }
            file.write(data.Body);
            file.end();
            count++;
            if (count === stories.length) {
                let command = ffmpeg();
                for (let i = 0; i < files.length; i++) {
                    command.input(files[i]);
                }
                command.on('error', err => {
                    console.log(err);
                });
                command.on('end', () => {
                    fs.readFile(path.join(dir, '_titles.mp3'), (err, data) => {
                        if (err) {
                            console.log(err);

                            return;
                        } else if (!data) {
                            return;
                        }
                        let base64data = new Buffer(data, 'binary');
                        let uploadParams = {
                            Bucket: 'com.getstoryflow.audio.'+env,
                            Key: '_titles.mp3',
                            Body: base64data
                        };
                        s3.upload(uploadParams, (err, data) => {
                            if (err) {
                                console.log(err);

                                return;
                            }
                            convert('_titles.mp3', env);
                            rimraf(dir);
                        });
                    });
                });
                command.mergeToFile(path.join(dir, '_titles.mp3'), dir);
            }
        });
    });
};

const upload = (req, res) => {
    if (req.files.length > 0) {
        convert(req.files[0].key);
        res.send('https://s3.amazonaws.com/com.getstoryflow.audio.production/'+req.files[0].key);
    } else {
        res.sendStatus(400);
    }
};

const getVoices = (req, res) => {
    polly.describeVoices((err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            res.send(data.Voices);
        }
    });
};

const generate = (req, res) => {
    if (req.body && req.body.text) {
        let text = '<speak>'+req.body.text+'</speak>';
        let voice = req.body.voice || 'Joey';
        let key = Date.now().toString()+'-'+text.substring(0, 13).toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-.]+/g, '')+'-'+voice+'.mp3';
        let params = {
            Text: text,
            TextType: 'ssml',
            OutputFormat: 'mp3',
            VoiceId: voice
        };
        polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(err.statusCode);
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {
                    let uploadParams = {
                        Bucket: 'com.getstoryflow.audio.production',
                        Key: key,
                        Body: data.AudioStream
                    };
                    s3.upload(uploadParams, (err, data) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(err.statusCode);
                        } else {
                            res.send('https://s3.amazonaws.com/com.getstoryflow.audio.production/'+key);
                        }
                    });
                }
            }
        });
    } else {
        res.sendStatus(400);
    }
};

const concat = (req, res) => {
    if(!Array.isArray(req.body.lines)){
        res.sendStatus(400);
        return;
    }

    let dir = path.join(__dirname, 'tmp', Date.now().toString());
    fs.existsSync(dir) || fs.mkdirSync(dir);

    let files = [];
    let count = 0;

    let lines = req.body.lines;
    lines.forEach(line => {
        let key = path.basename(line);
        let file = fs.createWriteStream(path.join(dir, key));
        files.push(path.join(dir, key));
        let params = {
            Bucket: 'com.getstoryflow.audio.production',
            Key: key
        };
        s3.getObject(params, (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            file.write(data.Body);
            file.end();
            count++;
            if (count === lines.length) {
                let command = ffmpeg();
                let filename = randomstring.generate(8) + '.mp3';

                for (let i = 0; i < files.length; i++) {
                    command.input(files[i]);
                }
                command.on('error', err => {
                    console.log(err);
                    res.sendStatus(500);
                });
                command.on('end', () => {
                    fs.readFile(path.join(dir, filename), (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        } else if (!data) {
                            return;
                        }
                        let base64data = new Buffer(data, 'binary');
                        let uploadParams = {
                            Bucket: 'com.getstoryflow.audio.production',
                            Key: filename,
                            Body: base64data
                        };
                        s3.upload(uploadParams, (err, data) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            res.send(data.Location);
                            rimraf(dir);
                        });
                        // let params = {
                        //     Bucket: 'com.getstoryflow.audio.production',
                        //     Key: filename
                        // };

                        // let upload = s3Stream.upload(params);
                        // upload.maxPartSize(20971520);
                        // upload.concurrentParts(5);
                        // upload.on('error', err => {
                        //     console.log(err);
                        //     res.sendStatus(500);
                        // });

                        // upload.on('uploaded', (details) => {
                        //     res.send(details.Location);
                        //     rimraf(dir);
                        // })

                        // ffmpeg()
                        //     .format('mp3')
                        //     .input(path.join(dir, filename))
                        //     .audioChannels(2)
                        //     .audioCodec('libmp3lame')
                        //     .audioBitrate('48k')
                        //     .audioFrequency(16000)
                        //     .pipe(upload);
                    });
                });
                command.mergeToFile(path.join(dir, filename), dir);
            }
        });
    });
};

exports.upload = upload;
exports.updateTitles = updateTitles;
exports.getVoices = getVoices;
exports.generate = generate;
exports.concat = concat;

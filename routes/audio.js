const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const randomstring = require("randomstring");

ffmpeg.setFfmpegPath(ffmpegPath);

const AWS = require('aws-sdk'); 
AWS.config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

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

const uploadConcatPreviews = (dir, files, env) => {
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
                }
                rimraf(dir);
            });
        });
    });
    command.mergeToFile(path.join(dir, '_titles.mp3'), dir);
    command.audioChannels(2);
    command.audioCodec('libmp3lame');
    command.audioBitrate('48k');
    command.audioFrequency(16000);
}

exports.upload = (req, res) => {
    let filename = req.file.key;
    convert(filename);
    res.send('https://s3.amazonaws.com/com.getstoryflow.audio.production/'+filename);
};

exports.raw_upload = (req, res) => {
    if (req.files.length > 0) {
        res.send('https://s3.amazonaws.com/com.getstoryflow.audio.production/'+req.files[0].key);
    } else {
        res.sendStatus(400);
    }
}

exports.concat = (req, res) => {
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
                count++;
                if (count === lines.length) {
                    uploadConcatLines(dir, files, res);
                }
                return;
            }else{
                file.write(data.Body);
                file.end();
                count++;
                if (count === lines.length) {
                    uploadConcatLines(dir, files, res);
                }
            }
        });
    });
};

const uploadConcatLines = (dir, files, res) => {
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
        });
    });

    command.mergeToFile(path.join(dir, filename), dir);
    command.audioChannels(2);
    command.audioCodec('libmp3lame');
    command.audioBitrate('48k');
    command.audioFrequency(16000);
}


exports.getVoices = (req, res) => {
    polly.describeVoices((err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(err.statusCode);
        } else {
            res.send(data.Voices);
        }
    });
};


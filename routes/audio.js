const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const randomstring = require('randomstring');

ffmpeg.setFfmpegPath(ffmpegPath);

const AWS = require('aws-sdk');

AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

const s3 = new AWS.S3();
const polly = new AWS.Polly();

const s3Stream = require('s3-upload-stream')(s3);
const { writeToLogs } = require('./../services');

const rimraf = (dir_path) => {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach((entry) => {
      const entry_path = path.join(dir_path, entry);
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
  const params = {
    Bucket: `com.getstoryflow.audio.${env}`,
    Key: key,
  };

  const upload = s3Stream.upload(params);
  upload.maxPartSize(20971520);
  upload.concurrentParts(5);
  upload.on('error', (err) => {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
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
  const command = ffmpeg();
  for (let i = 0; i < files.length; i++) {
    command.input(files[i]);
  }
  command.on('error', (err) => {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
  });
  command.on('end', () => {
    fs.readFile(path.join(dir, '_titles.mp3'), (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });

        return;
      }
      if (!data) {
        return;
      }
      const base64data = new Buffer(data, 'binary');
      const uploadParams = {
        Bucket: `com.getstoryflow.audio.${env}`,
        Key: '_titles.mp3',
        Body: base64data,
      };
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', { err });
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
};

exports.upload = (req, res) => {
  const filename = req.file.key;
  try {
    convert(filename);
  } catch (err) {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
  }
  res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${filename}`);
};

exports.raw_upload = (req, res) => {
  if (req.files.length > 0) {
    res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.files[0].key}`);
  } else {
    res.sendStatus(400);
  }
};

exports.concat = async (req, res) => {
  if (!Array.isArray(req.body.lines)) {
    res.sendStatus(400);
    return;
  }

  const dir = path.join(__dirname, 'tmp', Date.now().toString());
  fs.existsSync(dir) || fs.mkdirSync(dir);

  const files = [];
  let count = 0;

  const { lines } = req.body;
  for (const line of lines) {
    const key = path.basename(line);
    const file = fs.createWriteStream(path.join(dir, key));
    files.push(path.join(dir, key));
    const params = {
      Bucket: 'com.getstoryflow.audio.production',
      Key: key,
    };
    try {
      const data = await s3.getObject(params).promise();
      file.write(data.Body);
      file.end();
      count++;
      if (count === lines.length) {
        uploadConcatLines(dir, files, res);
      }
    } catch (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      return res.sendStatus(500);
    }
  }
};

const uploadConcatLines = (dir, files, res) => {
  const command = ffmpeg();
  const filename = `${randomstring.generate(8)}.mp3`;

  for (let i = 0; i < files.length; i++) {
    command.input(files[i]);
  }
  command.on('error', (err) => {
    writeToLogs('CREATOR_BACKEND_ERRORS', { err });
    res.sendStatus(500);
  });
  command.on('end', () => {
    fs.readFile(path.join(dir, filename), (err, data) => {
      if (err) {
        writeToLogs('CREATOR_BACKEND_ERRORS', { err });
        return;
      }
      if (!data) {
        return;
      }
      const base64data = new Buffer(data, 'binary');
      const uploadParams = {
        Bucket: 'com.getstoryflow.audio.production',
        Key: filename,
        Body: base64data,
      };
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          writeToLogs('CREATOR_BACKEND_ERRORS', { err });
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
};

exports.getVoices = (req, res) => {
  polly.describeVoices((err, data) => {
    if (err) {
      writeToLogs('CREATOR_BACKEND_ERRORS', { err });
      res.sendStatus(err.statusCode);
    } else {
      res.send(data.Voices);
    }
  });
};

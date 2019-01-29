const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream')
const { s3Stream } = require('./services')
const fs = require('fs')
const S3_DEST = 'com.getvoiceflow.logs/creators'

const pad = (num) => {
  return (num > 9 ? "" : "0") + num
}

const log_name_generator = (time, index) => {
  let time = new Date
  return [time.getFullYear(), pad(time.getMonth() + 1), pad(time.getHours())].join('_') + '.log'
}

var access_log_stream = rfs(log_name_generator, {
  interval: '1h',
  path: path.join(__dirname, 'log'),
  immutable: true
})
access_log_stream.on('error', console.trace)
access_log_stream.on('warning', console.trace)

const try_transfer = (old_file_path, tries) => {
  if(tries > 5){
      return -1
  }

  let split_path = old_file_path.split(path.sep)
  let upload = s3Stream.upload({
      'Bucket': S3_DEST,
      'Key': split_path[split_path.length - 1]
  })

  upload.on('error', function(error) {
      console.trace(error)
      try_transfer(old_file_path, tries + 1)
  })

  let file_read = fs.createReadStream(old_file_path)
  file_read.pipe(upload)

  return 0
}

access_log_stream.on('rotated', (file_name) => {
  try{
    let transfer_status = try_transfer(file_name, 0)
      if (transfer_status === 0){
        fs.unlink(file_name, (err) => {
            if(err){
                console.trace(err)
            }
        })
    }
  } catch (err) {
    console.trace(err)
  }
})

var log_format = (tokens, req, res) => {
  let request = {
    user: req.user,
    cookies: req.cookies,
    params: req.params,
    body: req.body
  }
  let log = ''
  
  try {
    log = ['Timestamp', new Date().getTime() / 1000,
    'Method:', tokens.method(req, res), 
    'URL:', tokens.url(req, res), 
    'Status:', tokens.status(req, res), 
    'Response Time:', tokens['response-time'](req, res),
    'Request:', JSON.stringify(request)].join(' ')
  } catch (err) {
    console.trace(err)
  }

  return log
}

exports.request_logger = morgan(log_format, { stream: access_log_stream })
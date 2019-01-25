const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream')

const pad = (num) => {
  return (num > 9 ? "" : "0") + num
}

const log_name_generator = () => {
  let time = new Date
  return [time.getFullYear(), pad(time.getMonth() + 1), pad(time.getHours())].join('_') + '.log'
}

var access_log_stream = rfs(log_name_generator, {
  interval: '1h',
  path: path.join(__dirname, 'log')
})

var log_format = (tokens, req, res) => {
  console.log(res)
  let request = {
    user: req.user,
    cookies: req.cookies,
    params: req.params,
    body: req.body
  }

  return ['Method:', tokens.method(req, res), 
          'URL:', tokens.url(req, res), 
          'Status:', tokens.status(req, res), 
          'Response Time:', tokens['response-time'](req, res),
          'Request:', JSON.stringify(request),
          'Response:', JSON.stringify(res.body)].join(' ')
}

exports.request_logger = morgan(log_format, { stream: access_log_stream })
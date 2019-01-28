const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer()
const PROXY_TARGET = 'https://www.google.com/'

const proxyRequest = (req, res) => {
  const path = req.params.path
  let target = PROXY_TARGET
  console.log("PATH", path)
  if (path) target = `${target}/${path}`
  proxy.web(req, res, { target: target, ignorePath: true, changeOrigin: true }, e => {
    console.log("Proxy error", e)
    throw(e)
  })
}

exports.proxyRequest = proxyRequest
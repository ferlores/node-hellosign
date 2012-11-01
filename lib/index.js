var request = require('request')
  , endpoints = require('./endpoints.json')

module.exports = function HelloSign(options) {
  var auth = encodeURIComponent(options.username) + ':' + encodeURIComponent(options.password)

  endpoints.forEach(function (ep) {
    HelloSign.prototype[ep.name] = function (data, cb) {
      if (typeof data === 'function') cb = data, data = {}
      makeRequest(auth, ep, data, cb);
    }
  })
}

function makeRequest (auth, ep, data, cb) {
  var url = 'https://' + auth + '@api.hellosign.com/v3' + ep.url + (data.id || '')

  var r = request[ep.method](url, function (er, res, body) {
    cb(er, JSON.parse(body))
  })

  var form = r.form()
  Object.keys(data).forEach(function (key) {
    if (key !== 'id') form.append(key, data[key])
  })
}

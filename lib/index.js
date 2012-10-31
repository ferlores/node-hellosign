var request = require('request')
  , endpoints = require('./endpoints.json')

module.exports = function HelloSign(options) {
  var auth = encodeURIComponent(options.username) + ':' + encodeURIComponent(options.password)

  endpoints.forEach(function (ep) {
    HelloSign.prototype[ep.name] = function (data, cb) {
      if (typeof data === 'function') cb = data, data = undefined
      makeRequest(auth, ep, data, cb);
    }
  })
}

function makeRequest (auth, ep, data, cb) {
  var url = 'https://' + auth + '@api.hellosign.com/v3' + ep.url
    , options = {
      url: url
    , method: ep.method
    }

  if (data) options.form = data

  request(options, function (er, res, body) {
    cb(er, JSON.parse(body))
  });
}

var request = require('request')
  , _ = require('underscore')
  , endpoints = require('./endpoints.json')

_.templateSettings = {
  interpolate : /\{(.+?)\}/g
};

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
  var endpoint = _.template(ep.url, data)
    , url = 'https://' + auth + '@api.hellosign.com/v3' + endpoint

  var r = request[ep.method](url, function (er, res, body) {
    cb(er, JSON.parse(body))
  })

  var form = r.form()
  Object.keys(data).forEach(function (key) {
    if (key !== 'id') form.append(key, data[key])
  })
}

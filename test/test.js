var mocha = require('mocha')
  , assert = require('assert')
  , fs = require('fs')
  , path = require('path')
  , HelloSign = require('../index.js')
  , username = process.env['USERNAME']
  , password = process.env['PASSWORD']
  , api = new HelloSign({
    username: username
  , password: password
  })

describe('Account', function(){
  describe('getAccount', function(){
    it('should return current user email', function(done){
      api.getAccount(function (er, body) {
        assert.equal(body.account.email_address, username)
        done()
      })      
    })
  })
  describe('updateAccount', function(){
    it('should return callback_url', function(done){
      var callback_url = 'http://www.google.com'
      api.updateAccount({callback_url: callback_url}, function (er, body) {
        assert.equal(body.account.callback_url, callback_url)
        done()
      })      
    })
  })
  describe('createAccount', function(){
    it('should return a bad request', function(done){
      api.createAccount({
          email_address: username
        , password: 'xxxxxx'
        }, function (er, body) {
          assert.equal(body.error.error_name, 'bad_request')
          done()
      })      
    })
  })
})

describe('Signature Request', function(){
  var request_id

  describe('create request', function(){
    it('should return current user email', function(done){
      var options = {
        'signers[0][name]': 'Test User'
      , 'signers[0][email_address]': username
      , 'file[1]': fs.createReadStream(path.join(__dirname, 'test.pdf'))
      }

      api.createRequest(options, function (er, body) {
        assert.equal(body.signature_request.signatures[0].signer_email_address, username)
        request_id = body.signature_request.signature_request_id
        done()
      })
    })
  })
  describe('list requests', function(){
    it('should return the list with the request created in the previous test', function(done){
      api.listRequests(function (er, body) {
        var found = false
        body.signature_requests.forEach(function (signature) {
          found = found || signature.signature_request_id === request_id
        })
        assert.ok(found)
        done()
      })
    })
  })
  describe('get request', function(){
    it('should return the request created in the previous test', function(done){
      api.getRequest({signature_request_id: request_id}, function (er, body) {
        assert.equal(body.signature_request.signature_request_id, request_id)
        done()
      })
    })
  })
  describe('send reminder', function(){
    it('should return ok', function(done){
      api.sendReminder({
        signature_request_id: request_id,
        email_address: username
      }, function (er, body) {
        assert.equal(body.signature_request.signature_request_id, request_id)
        assert.ok(!body.signature_request.has_error)
        done()
      })
    })
  })
  describe('get final copy', function(){
    it('should return forbidden (not complete)', function(done){
      api.getFinalCopy({signature_request_id: request_id}, function (er, body) {
        assert.equal(body.error.error_msg, 'Not allowed (not complete)')
        assert.equal(body.error.error_name, 'forbidden')
        done()
      })
    })
  })
  describe('cancel the request', function(){
    it('should return undefined', function(done){
      api.cancelRequest({signature_request_id: request_id}, function (er, body) {
        console.log(body)
        assert.ok(!body)
        done()
      })
    })
  })
  describe('send request with reusable form', function(){
    it('should be tested')
  })
})

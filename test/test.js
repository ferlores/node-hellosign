var mocha = require('mocha')
  , assert = require('assert')
  , HelloSign = require('../index.js')
  , keys = require('./keys.json')
  , api = new HelloSign(keys)


describe('Account', function(){
  describe('getAccount', function(){
    it('should return current user email', function(done){
      api.getAccount(function (er, body) {
        assert.equal(body.account.email_address, keys.username)
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
          email_address: keys.username
        , password: 'xxxxxx'
        }, function (er, body) {
          assert.equal(body.error.error_name, 'bad_request')
          done()
      })      
    })
  })
})

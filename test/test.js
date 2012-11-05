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
        assert.ok(!body)
        done()
      })
    })
  })
})

describe('Teams', function(){
  var teamName = 'testTeam'

  describe('create team', function(){
    it('should return the info about the team', function(done){
      api.createTeam({name: teamName}, function (er, body) {
        assert.equal(body.team.name, teamName)
        done()
      })
    })
  })
  describe('update team', function(){
    it('should return the info about the team', function(done){
      teamName = 'testTeam2'
      api.updateTeam({name: teamName}, function (er, body) {
        assert.equal(body.team.name, teamName)
        done()
      })
    })
  })
  describe('get team', function(){
    it('should return the info about the team', function(done){
      api.getTeam(function (er, body) {
        assert.equal(body.team.name, teamName)
        done()
      })
    })
  })
  describe('remove member', function(){
    it('should return error: user cannot be removed', function(done){
      api.removeMember({email_address: username}, function (er, body) {
        assert.equal(body.error.error_msg, 'Team owner cannot be removed, you must delete your team instead')
        assert.equal(body.error.error_name, 'bad_request')
        done()
      })
    })
  })
  describe('add member', function(){
    it('should return error: account already in the team', function(done){
      api.addMember({email_address: username}, function (er, body) {
        assert.equal(body.error.error_msg, 'This account is already on your team')
        assert.equal(body.error.error_name, 'team_invite_failed')
        done()
      })
    })
  })
})

var form_id
describe('Reusable Forms', function(){

  describe('get forms list', function(){
    it('should return at least one reusable form', function(done){
      api.listForms(function (er, body) {
        assert.ok(body.reusable_forms[0])
        form_id = body.reusable_forms[0].reusable_form_id
        done()
      })
    })
  })
  describe('get reusable form', function(){
    it('should return the reusable form', function(done){
      api.getForm({reusable_form_id: form_id}, function (er, body) {
        assert.equal(body.reusable_form.reusable_form_id, form_id)
        done()
      })
    })
  })
  describe('add user to reusable form', function(){
    it('should return the reusable form', function(done){
      api.addUserForm({
        reusable_form_id: form_id,
        email_address: username
      }, function (er, body) {
        assert.equal(body.reusable_form.reusable_form_id, form_id)
        done()
      })
    })
  })
  describe('remove user from reusable form', function(){
    it('should return the reusable form', function(done){
      api.removeUserForm({
        reusable_form_id: form_id,
        email_address: username
      }, function (er, body) {
        assert.equal(body.reusable_form.reusable_form_id, form_id)
        done()
      })
    })
  })
})

describe('Signature Request', function(){
  describe('send request with reusable form', function(){
    it('should return a request', function (done) {
      var options = {
        'signers[client][name]': 'Test User'
      , 'signers[client][email_address]': username
      , 'reusable_form_id': form_id
      }

      api.sendForm(options, function (er, body) {
        assert.equal(body.signature_request.signatures[0].signer_email_address, username)
        done()
      })
    })
  })
})

describe('Teams', function(){
  describe('destroy the team', function(){
    it('should return undefined', function(done){
      api.destroyTeam(function (er, body) {
        assert.ok(!body)
        done()
      })
    })
  })
})

describe('Unclaimed Draft', function(){
  describe('create unclaimed draft', function(){
    it('should return an url', function(done){
      var opts = {'file[1]': fs.createReadStream(path.join(__dirname, 'test.pdf'))}
      api.createUnclaimedDraft(opts , function (er, body) {
        assert.ok(body.unclaimed_draft)
        done()
      })
    })
  })
})

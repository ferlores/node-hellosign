# node-hellosign

[![Build Status](https://travis-ci.org/ferlores/node-hellosign.png)](https://travis-ci.org/ferlores/node-hellosign)

It is a wrapper for [hellosign.com API](http://www.hellosign.com/api/reference)

## Install

```
npm install node-hellosign
```

## Quick Start

```javascript
var HelloSign = require('node-hellosign')
  , username = process.env['USERNAME']
  , password = process.env['PASSWORD']
  , api = new HelloSign({
    username: username
  , password: password
  })

var options = {
  'signers[0][name]': 'Test User'
, 'signers[0][email_address]': username
, 'file[1]': fs.createReadStream(path.join(__dirname, 'test.pdf'))
}

api.createRequest(options, function (er, res) {
  console.log(res)
})
```

## Callbacks and streaming

```
var stream = api.getFinalCopy({signature_request_id: id}, function (er, file) {
  process(file)  // process the hole file at the en of teh response
})

// process the chunks as they arrive
var file
stream.on('data', function (chunk) {
  file += chunk
})

stream.on('end', function () {
  console.log(file.length)
})
```

## Methods
All the methods receive two params:
* ```options``` _(optional)_: an object with the parameters of the request. Check [here](http://www.hellosign.com/api/reference) how is this object depending on the request
* ```callback``` _(required)_: callback, it gets as param the error and the response

Check http://www.hellosign.com/api/reference

### Account
* ```getAccount(cb)```: Returns your Account settings.
* ```updateAccount(opts, cb)```: Updates your Account's settings.
* ```createAccount(opts, cb)```: Signs up for a new HelloSign Account.

### Signature Requests
* ```getRequest(cb)```: Gets a SignatureRequest that includes the current status for each signer 
* ```listRequest(cb)```: Lists the SignatureRequests (both inbound and outbound) that you have access to.
* ```createRequest(opts, cb)```: Creates and sends a new SignatureRequest with the submitted documents.
* ```sendForm(opts, cb)```: Creates and sends a new SignatureRequest based off of a ReusableForm.
* ```sendReminder(opts, cb)```: Sends an email to the signer reminding them to sign the signature request.
* ```cancelRequest(opts, cb)```: Cancels a SignatureRequest.
* ```getFinalCopy(cb)```: Download the PDF copy of the finalized documents.

### Reusable Forms
* ```getForm(cb)```: Gets a ReusableForm which includes a list of Accounts that can access it.
* ```listForms(cb)```: Lists your ReusableForms.
* ```addUserForm(opts, cb)```: Gives the specified Account access to the specified ReusableForm.
* ```removeUserForm(opts, cb)```: Removes the specified Account's access to the specified ReusableForm.

### Teams
* ```getTeam(cb)```: Gets your Team and a list of its members
* ```createTeam(opts, cb)```: Creates a new Team
* ```updateTeam(ots, cb)```: Updates a Team's name
* ```destroyTeam(cb) ```: Deletes your Team.
* ```addMember(opts, cb)```: Adds or invites a user to your Team
* ```removeMember(opts, cb)```: Removes a user from your Team

### Unclaimed Draft
* ```createUnclaimedDraft(opts, cb)```: Creates a new Draft that can be claimed using the claim URL.

## Tests

In order to run the tests you need to register an account and to define a reusable form

```bash
export USERNAME=your@account.com
export PASSWORD=xxxxxxx 
cd node_modules/node-hellosign
npm test
```

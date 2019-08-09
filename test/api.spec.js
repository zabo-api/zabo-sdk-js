'use strict'

const should = require('should')
const crypto = require('crypto')
const sdk = require('../src/index.js')

describe('Zabo SDK API', () => {

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()
    sdk.api.resources.should.be.an.Object()

    sdk.api.resources.should.have.property('applications')
    sdk.api.resources.should.have.property('transactions')
    sdk.api.resources.should.have.property('walletProviders')
    sdk.api.resources.should.have.property('currencies')
  })

  it('should build a proper request object', function () {
    let request = sdk.api._buildRequest('GET', '/sessions')

    request.should.be.instanceof(Object)

    request.method.should.equal('get')
    request.url.should.equal('https://api.zabo.com/sandbox-v0/sessions')

    request.headers.should.have.property('X-Zabo-Sig')
    request.headers.should.have.property('X-Zabo-Timestamp')
  })

  it('should embed a valid timestamp in the request headers', function () {
    let request = sdk.api._buildRequest('GET', '/sessions')

    request.headers.should.have.property('X-Zabo-Timestamp')
    let date = new Date(request.headers['X-Zabo-Timestamp'])

    date.should.be.instanceof(Date)
    date.getTime().should.be.above(0)
  })

  it('should embed a valid HMAC signature in the request headers', function () {
    let request = sdk.api._buildRequest('GET', '/users?limit=25')

    request.should.be.instanceof(Object)

    request.method.should.equal('get')
    request.url.should.equal('https://api.zabo.com/sandbox-v0/users?limit=25')

    let timestamp = request.headers['X-Zabo-Timestamp']
    let text = timestamp + request.url
    let sig = crypto.createHmac('sha256', sdk.api.secretKey).update(text).digest('hex')

    request.headers.should.have.property('X-Zabo-Sig')
    request.headers['X-Zabo-Sig'].should.equal(sig)
  })

})

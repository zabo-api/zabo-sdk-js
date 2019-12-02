'use strict'

const should = require('should')
const sdk = require('../../src/sdk.js')

describe('Zabo SDK Wallet Providers Resource', () => {

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('walletProviders')

    sdk.api.resources.walletProviders.should.have.property('getList')
    sdk.api.resources.walletProviders.should.have.property('getOne')
  })

  it('walletProviders.getList() should fail if an invalid `limit` is provided', async function () {
    let response = await sdk.walletProviders.getList({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('walletProviders.getList() should fail if an invalid `cursor` is provided', async function () {
    let response = await sdk.walletProviders.getList({ cursor: 'not_a_valid_id' }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('cursor')
  })

  it('walletProviders.getOne() should fail if a provider name is not provided', async function () {
    let response = await sdk.walletProviders.getOne().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('name')
  })

})

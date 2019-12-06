'use strict'

const should = require('should')
const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')

describe('Zabo SDK Wallet Providers Resource', () => {
  let walletProviders

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

    walletProviders = await require('../../src/resources/wallet_providers')(mockApi)

    walletProviders.should.have.property('getList')
    walletProviders.should.have.property('getOne')
  })

  it('walletProviders.getList() should fail if an invalid `limit` is provided', async function () {
    let response = await walletProviders.getList({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('walletProviders.getList() should fail if an invalid `cursor` is provided', async function () {
    let response = await walletProviders.getList({ cursor: 'not_a_valid_id' }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('cursor')
  })

  it('walletProviders.getOne() should fail if a provider name is not provided', async function () {
    let response = await walletProviders.getOne().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('name')
  })

  it('walletProviders.getList() should return the list of wallet provider', async function () {
    let list = await walletProviders.getList()

    list.should.be.ok()
    list.data.should.be.an.Array()
    list.data[0].should.have.properties([ 'name', 'display_name', 'logo', 'auth_type', 'available_scopes', 'available_currencies' ])
  })

  it('walletProviders.getOne() should return one wallet provider', async function () {
    let walletProvider = await walletProviders.getOne('metamask')

    walletProvider.should.be.ok()
    walletProvider.should.have.properties([ 'name', 'display_name', 'logo', 'auth_type', 'available_scopes', 'available_currencies' ])
    walletProvider.name.should.be.eql('metamask')
  })
})

'use strict'

const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')
require('should')

describe('Zabo SDK Providers Resource', () => {
  let providers

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('providers')

    providers = await require('../../src/resources/providers')(mockApi)

    providers.should.have.property('getList')
    providers.should.have.property('getOne')
  })

  it('providers.getList() should fail if an invalid `limit` is provided', async function () {
    const response = await providers.getList({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('providers.getList() should fail if an invalid `cursor` is provided', async function () {
    const response = await providers.getList({ cursor: 'not_a_valid_id' }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('cursor')
  })

  it('providers.getOne() should fail if a provider name is not provided', async function () {
    const response = await providers.getOne().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('name')
  })

  it('providers.getList() should return the list of provider', async function () {
    const list = await providers.getList()

    list.should.be.ok()
    list.data.should.be.an.Array()
    list.data[0].should.have.properties(['name', 'display_name', 'logo', 'auth_type', 'available_scopes', 'available_currencies'])
  })

  it('providers.getOne() should return one provider', async function () {
    const provider = await providers.getOne('metamask')

    provider.should.be.ok()
    provider.should.have.properties(['name', 'display_name', 'logo', 'auth_type', 'available_scopes', 'available_currencies'])
    provider.name.should.be.eql('metamask')
  })
})

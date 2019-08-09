'use strict'

const should = require('should')
const sdk = require('../../src/index.js')

describe('Zabo SDK Applications Resource', () => {

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('applications')

    sdk.api.resources.applications.should.have.property('getApplication')
  })

  it('applications.getApplication() should fail if an application id has not been set', async function () {
    let response = await sdk.applications.getApplication().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(401)
  })

  it('applications.setId() should fail if an invalid application id is provided', function () {
    should(() => {
      sdk.applications.setId('not a valid id')
    }).throw(Error)
  })

  it('applications.setId() should set id if a valid application id is provided', function () {
    let uuid = '0b1fa5c7-db98-47ff-9a16-09e6493b3ba8'

    should(() => {
      sdk.applications.setId(uuid)
    }).not.throw(Error)

    sdk.applications.id.should.equal(uuid)
  })

})

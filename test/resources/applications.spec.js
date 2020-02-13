'use strict'

const should = require('should')
const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')

describe('Zabo SDK Applications Resource', () => {
  let applications

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('applications')

    applications = await require('../../src/resources/applications')(mockApi)

    applications.should.have.property('get')
    applications.should.have.property('getInfo')
  })

  it('applications.get() should fail if an application id has not been set', async function () {
    const response = await applications.get().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(401)
  })

  it('applications.setId() should fail if an invalid application id is provided', function () {
    should(() => {
      applications.setId('not a valid id')
    }).throw(Error)
  })

  it('applications.setId() should set id if a valid application id is provided', function () {
    const uuid = 'b5cfb0d8-58de-4786-9545-3d38521d7d2b'

    should(() => {
      applications.setId(uuid)
    }).not.throw(Error)

    applications.id.should.equal(uuid)
  })

  it('accounts.get() should return an application and cache application data', async function () {
    const application = await applications.get()

    application.should.be.ok()
    application.should.have.properties(['id', 'name', 'status', 'currencies', 'providers', 'authorized_origins'])

    applications.data.should.be.eql(application)
    applications.id.should.be.equal(application.id)
  })

  it('accounts.getInfo() should return application info and cache application data', async function () {
    // Mock DOM
    require('jsdom-global')()
    const originalGlobal = global
    global = undefined // eslint-disable-line

    const application = await applications.getInfo()

    application.should.be.ok()
    application.should.have.properties(['id', 'name', 'status', 'currencies', 'providers', 'authorized_origins'])

    applications.data.should.be.eql(application)
    applications.id.should.be.equal(application.id)

    // Undo mock DOM
    global = originalGlobal // eslint-disable-line
  })
})

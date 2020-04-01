'use strict'

const should = require('should')
const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')

describe('Zabo SDK Teams Resource', () => {
  let teams

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('teams')

    teams = await require('../../src/resources/teams')(mockApi)

    teams.should.have.property('get')
  })

  it('teams.get() should fail if an team id has not been set', async function () {
    const response = await teams.get().should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(401)
  })

  it('teams.setId() should fail if an invalid team id is provided', function () {
    should(() => {
      teams.setId('not a valid id')
    }).throw(Error)
  })

  it('teams.setId() should set id if a valid team id is provided', function () {
    const uuid = 'b5cfb0d8-58de-4786-9545-3d38521d7d2b'

    should(() => {
      teams.setId(uuid)
    }).not.throw(Error)

    teams.id.should.equal(uuid)
  })

  it('accounts.get() should return an team and cache team data [server-side]', async function () {
    const team = await teams.get()

    team.should.be.ok()
    team.should.have.properties(['id', 'name', 'status', 'currencies', 'providers', 'authorized_origins'])

    teams.data.should.be.eql(team)
    teams.id.should.be.equal(team.id)
  })

  it('accounts.get() should return team and cache team data [client-side]', async function () {
    // Mock DOM
    require('jsdom-global')()
    const originalGlobal = global
    global = undefined // eslint-disable-line

    const team = await teams.get()

    team.should.be.ok()
    team.should.have.properties(['id', 'name', 'status', 'currencies', 'providers', 'authorized_origins'])

    teams.data.should.be.eql(team)
    teams.id.should.be.equal(team.id)

    // Undo mock DOM
    global = originalGlobal // eslint-disable-line
  })
})

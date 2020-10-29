'use strict'

const utils = require('../src/utils.js')
require('should')

describe('Zabo SDK Utils', () => {
  it('uuidValidate() accepts valid uuidv1', function () {
    utils.uuidValidate('23d57c30-afe7-11e4-ab7d-12e3f512a338').should.be.true()
  })

  it('uuidValidate() accepts valid uuidv4', function () {
    utils.uuidValidate('09bb1d8c-4965-4788-94f7-31b151eaba4e').should.be.true()
  })

  it('uuidValidate() denies if invalid', function () {
    utils.uuidValidate().should.be.false()
    utils.uuidValidate(null).should.be.false()
    utils.uuidValidate(1).should.be.false()
    utils.uuidValidate({}).should.be.false()
    utils.uuidValidate(false).should.be.false()
    utils.uuidValidate('foo').should.be.false()
    utils.uuidValidate('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu').should.be.false()
  })
})

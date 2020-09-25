'use strict'

const mockApi = require('../mock/api.js')
require('should')

const ORDER_PROPERTIES = [
  'id',
  'base_currency',
  'quote_currency',
  'base_amount',
  'buy_or_sell',
  'quote_amount',
  'price',
  'time_in_force',
  'ttl',
  'provide_liquidity_only',
  'type',
  'status',
  'done_at',
  'done_reason',
  'filled_size',
  'fill_fees',
  'settled',
  'created_at'
]

describe('Zabo SDK Trading Resource', () => {
  let trading

  it('should be instantiated and expose the methods', async function () {
    trading = await require('../../src/resources/trading')(mockApi)

    trading.should.have.property('getSymbols')
    trading.should.have.property('getTickerInfo')
    trading.should.have.property('getOrders')
    trading.should.have.property('getOrder')
    trading.should.have.property('createOrder')
    trading.should.have.property('cancelOrders')
    trading.should.have.property('cancelOrder')
  })

  // trading.getSymbols()
  it('trading.getSymbols() should fail if account not connected', async function () {
    trading._setAccount(null)

    const response = await trading.getSymbols()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not connected')

    // mock account data
    trading._setAccount({ id: 'fake-account' })
  })

  it('trading.getSymbols() should return the list of symbols', async function () {
    const list = await trading.getSymbols()

    list.should.be.ok()
    list.data.should.be.an.Array()
    list.data[0].should.have.properties(['base_currency', 'quote_currency'])
  })

  // trading.getTickerInfo()
  it('trading.getTickerInfo() should fail if account not connected', async function () {
    trading._setAccount(null)

    const response = await trading.getTickerInfo()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not connected')

    // mock account data
    trading._setAccount({ id: 'fake-account' })
  })

  it('trading.getTickerInfo() should fail if `baseCurrency` is missing', async function () {
    const response = await trading.getTickerInfo({ quoteCurrency: 'USD' })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Missing')
    response.message.should.containEql('baseCurrency')
  })

  it('trading.getTickerInfo() should fail if `quoteCurrency` is missing', async function () {
    const response = await trading.getTickerInfo({ baseCurrency: 'BTC' })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Missing')
    response.message.should.containEql('quoteCurrency')
  })

  it('trading.getTickerInfo() should return ticker information', async function () {
    const response = await trading.getTickerInfo({ baseCurrency: 'BTC', quoteCurrency: 'USD' })

    response.should.be.ok()
    response.should.have.properties(['last_price', 'last_size', 'ask', 'ask_size', 'bid', 'bid_size', 'volume', 'timestamp'])
  })

  // trading.getOrders()
  it('trading.getOrders() should fail if account not connected', async function () {
    trading._setAccount(null)

    const response = await trading.getOrders()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not connected')

    // mock account data
    trading._setAccount({ id: 'fake-account' })
  })

  it('trading.getOrders() should return the list of orders', async function () {
    const list = await trading.getOrders()

    list.should.be.ok()
    list.data.should.be.an.Array()
    list.data[0].should.have.properties(ORDER_PROPERTIES)
  })

  // trading.getOrder()
  it('trading.getOrder() should fail if account not connected', async function () {
    trading._setAccount(null)

    const response = await trading.getOrder()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not connected')

    // mock account data
    trading._setAccount({ id: 'fake-account' })
  })

  it('trading.getOrder() should fail if `orderId` is missing', async function () {
    const response = await trading.getOrder({})
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Missing')
    response.message.should.containEql('orderId')
  })

  it('trading.getOrder() should fail if `orderId` is invalid', async function () {
    const response = await trading.getOrder({ orderId: 'not-an-uuid' })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('orderId')
    response.message.should.containEql('UUID')
  })

  it('trading.getOrder() should return the order', async function () {
    const response = await trading.getOrder({ orderId: 'c1bea143-15b1-4ae5-a33f-a25f32937559' })

    response.should.be.ok()
    response.should.have.properties(ORDER_PROPERTIES)
  })

  // trading.createOrder()
  it('trading.createOrder() should fail if account not connected', async function () {
    trading._setAccount(null)

    const response = await trading.createOrder()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not connected')

    // mock account data
    trading._setAccount({ id: 'fake-account' })
  })

  it('trading.createOrder() should fail if `baseCurrency` is missing', async function () {
    const response = await trading.createOrder({
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      baseAmount: '0.001',
      priceLimit: '11537.56',
      timeInForce: 'GTC',
      provideLiquidityOnly: true
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Missing')
    response.message.should.containEql('baseCurrency')
  })

  it('trading.createOrder() should fail if `quoteCurrency` is missing', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      buyOrSell: 'buy',
      baseAmount: '0.001',
      priceLimit: '11537.56',
      timeInForce: 'GTC',
      provideLiquidityOnly: true
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Missing')
    response.message.should.containEql('quoteCurrency')
  })

  it('trading.createOrder() should fail if `baseAmount` is 0', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      baseAmount: '0',
      timeInForce: 'GTC'
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('greater')
    response.message.should.containEql('baseAmount')
  })

  it('trading.createOrder() should fail if `baseAmount` is negative', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      baseAmount: '-1',
      timeInForce: 'GTC'
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('greater')
    response.message.should.containEql('baseAmount')
  })

  it('trading.createOrder() should fail if `quoteAmount` is 0', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      quoteAmount: '0',
      timeInForce: 'GTC'
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('greater')
    response.message.should.containEql('quoteAmount')
  })

  it('trading.createOrder() should fail if `quoteAmount` is negative', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      quoteAmount: '-1',
      timeInForce: 'GTC'
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('greater')
    response.message.should.containEql('quoteAmount')
  })

  it('trading.createOrder() should fail if `priceLimit` is 0', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      priceLimit: '0',
      timeInForce: 'GTC'
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('greater')
    response.message.should.containEql('priceLimit')
  })

  it('trading.createOrder() should fail if `priceLimit` is negative', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      priceLimit: '-1',
      timeInForce: 'GTC'
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('greater')
    response.message.should.containEql('priceLimit')
  })

  it('trading.createOrder() should fail if `buyOrSell` is missing', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      baseAmount: '0.001',
      priceLimit: '11537.56',
      timeInForce: 'GTC',
      provideLiquidityOnly: true
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Missing')
    response.message.should.containEql('buyOrSell')
  })

  it('trading.createOrder() should fail if `buyOrSell` is not valid', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'trade',
      baseAmount: '0.001',
      priceLimit: '11537.56',
      timeInForce: 'GTC',
      provideLiquidityOnly: true
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Invalid')
    response.message.should.containEql('buyOrSell')
  })

  it('trading.createOrder() should fail if `timeInForce` is not valid', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      baseAmount: '0.001',
      priceLimit: '11537.56',
      timeInForce: 'ABC',
      provideLiquidityOnly: true
    })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Invalid')
    response.message.should.containEql('timeInForce')
  })

  it('trading.createOrder() should create and return the order', async function () {
    const response = await trading.createOrder({
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      buyOrSell: 'buy',
      baseAmount: '0.001',
      priceLimit: '11537.56',
      timeInForce: 'GTC',
      provideLiquidityOnly: true
    })

    response.should.be.ok()
    response.should.have.properties(ORDER_PROPERTIES)
  })

  // trading.cancelOrders()
  it('trading.cancelOrders() should fail if account not connected', async function () {
    trading._setAccount(null)

    const response = await trading.cancelOrders()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not connected')

    // mock account data
    trading._setAccount({ id: 'fake-account' })
  })

  it('trading.cancelOrders() should cancel all orders', async function () {
    const response = await trading.cancelOrders()

    response.should.be.ok()
    response.data.should.be.an.Array()
  })

  // trading.cancelOrder()
  it('trading.cancelOrder() should fail if account not connected', async function () {
    trading._setAccount(null)

    const response = await trading.cancelOrder()
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Not connected')

    // mock account data
    trading._setAccount({ id: 'fake-account' })
  })

  it('trading.cancelOrder() should fail if `orderId` is missing', async function () {
    const response = await trading.cancelOrder({})
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('Missing')
    response.message.should.containEql('orderId')
  })

  it('trading.cancelOrder() should fail if `orderId` is invalid', async function () {
    const response = await trading.cancelOrder({ orderId: 'not-an-uuid' })
      .should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('orderId')
    response.message.should.containEql('UUID')
  })

  it('trading.cancelOrder() should cancel the order', async function () {
    const data = { orderId: 'c1bea143-15b1-4ae5-a33f-a25f32937559' }
    const response = await trading.cancelOrder(data)

    response.should.be.ok()
    response.data.should.be.an.Array()
    response.data.should.containEql(data.orderId)
  })
})

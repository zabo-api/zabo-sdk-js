/**
 * @Copyright (c) 2019-present, Zabo & Modular, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const utils = require('../utils')
const { SDKError } = require('../err')

/**
 * @typedef {{
 *  id?: String
 *  base_currency?: String
 *  quote_currency?: String
 *  base_amount?: String
 *  buy_or_sell?: 'buy' | 'sell'
 *  quote_amount?: String
 *  price?: String
 *  time_in_force?: String
 *  ttl?: Number
 *  provide_liquidity_only?: Boolean
 *  type?: 'limit' | 'market'
 *  status?: String
 *  created_at?: Number
 *  done_at?: Number
 *  done_reason?: String
 *  filled_size?: String
 *  fill_fees?: String
 *  settled?: Boolean
 *  request_id?: String
 * }} Order
 *
 * @typedef {[{
 *  base_currency?: String
 *  quote_currency?: String
 * }]} GetSymbolsResp
 *
 * @typedef {{
 *  last_price?: String
 *  last_size?: String
 *  ask?: String
 *  ask_size?: String
 *  bid?: String
 *  bid_size?: String
 *  volume?: String
 *  timestamp?: Number
 *  request_id?: String
 * }} GetTickerInfoResp
 *
 * @typedef {[Order]} GetOrdersResp
 *
 * @typedef {Order} GetOrderResp
 *
 * @typedef {Pick<Order, 'id' | 'base_currency' | 'quote_currency' | 'buy_or_sell' | 'type' | 'provide_liquidity_only' | 'created_at' | 'status'>} CreateOrderResp
 *
 * @typedef {[String]} CancelOrdersResp
 *
 * @typedef {CancelOrdersResp} CancelOrderResp
 */

/**
 * Trading API.
 */
class Trading {
  constructor (api) {
    /** @private */
    this.api = api
    this.account = null
  }

  /**
   * @private
   */
  _setAccount (account) {
    this.account = account
  }

  /**
   * This function returns the trading tickers available at the given account's provider.
   * These pairs can be used in the remaining calls to the Zabo Trading API.
   * @returns {Promise<GetSymbolsResp>} API response.
   */
  async getSymbols () {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    }

    try {
      return this.api.request('GET', `/accounts/${this.account.id}/trading-symbols`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function returns the current market information available for the currency pair,
   * at the provider, for the given account.
   * @param {{
   *  baseCurrency: String
   *  quoteCurrency: String
   * }} param0 Request parameters.
   * @returns {Promise<GetTickerInfoResp>} API response.
   */
  async getTickerInfo ({ baseCurrency, quoteCurrency } = {}) {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!baseCurrency) {
      throw new SDKError(400, '[Zabo] Missing `baseCurrency` parameter. See: https://zabo.com/docs/#get-ticker-info')
    } else if (!quoteCurrency) {
      throw new SDKError(400, '[Zabo] Missing `quoteCurrency` parameter. See: https://zabo.com/docs/#get-ticker-info')
    }

    try {
      return this.api.request('GET', `/accounts/${this.account.id}/tickers/${baseCurrency}-${quoteCurrency}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function returns all active orders for the given account.
   * @returns {Promise<GetOrdersResp>} API response.
   */
  async getOrders () {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    }

    try {
      return this.api.request('GET', `/accounts/${this.account.id}/orders`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function returns the specific order for the given order id.
   * @param {{
   *  orderId: String
   * }} param0 Request parameters.
   * @returns {Promise<GetOrderResp>} API response.
   */
  async getOrder ({ orderId } = {}) {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!orderId) {
      throw new SDKError(400, '[Zabo] Missing `orderId` parameter. See: https://zabo.com/docs/#get-an-order')
    } else if (!utils.uuidValidate(orderId)) {
      throw new SDKError(400, '[Zabo] `orderId` must be a valid UUID v4. See: https://zabo.com/docs/#get-an-order')
    }

    try {
      return this.api.request('GET', `/accounts/${this.account.id}/orders/${orderId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function creates a new trade order.
   * @param {{
   *  baseCurrency: String
   *  baseAmount?: String
   *  quoteCurrency: String
   *  quoteAmount?: String
   *  buyOrSell: 'buy' | 'sell'
   *  priceLimit?: String
   *  timeInForce?: String
   *  ttl?: Number
   *  provideLiquidityOnly?: Boolean
   * }} param0 Request parameters.
   * @returns {Promise<CreateOrderResp>} API response.
   */
  async createOrder ({ baseCurrency, quoteCurrency, buyOrSell, priceLimit, baseAmount, quoteAmount, provideLiquidityOnly, timeInForce, ttl } = {}) {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!baseCurrency) {
      throw new SDKError(400, '[Zabo] Missing `baseCurrency` parameter. See: https://zabo.com/docs/#place-new-order')
    } else if (!quoteCurrency) {
      throw new SDKError(400, '[Zabo] Missing `quoteCurrency` parameter. See: https://zabo.com/docs/#place-new-order')
    } else if (typeof baseAmount !== 'undefined' && baseAmount <= 0) {
      throw new SDKError(400, '[Zabo] `baseAmount` must be greater than 0. See: https://zabo.com/docs/#place-new-order')
    } else if (typeof quoteAmount !== 'undefined' && quoteAmount <= 0) {
      throw new SDKError(400, '[Zabo] `quoteAmount` must be greater than 0. See: https://zabo.com/docs/#place-new-order')
    } else if (typeof priceLimit !== 'undefined' && priceLimit <= 0) {
      throw new SDKError(400, '[Zabo] `priceLimit` must be greater than 0. See: https://zabo.com/docs/#place-new-order')
    }

    utils.validateEnumParameter('buyOrSell', buyOrSell, ['buy', 'sell'])
    utils.validateEnumParameter('timeInForce', timeInForce, ['GTC', 'GTT', 'IOC', 'FOK'], true)

    try {
      return this.api.request('POST', `/accounts/${this.account.id}/orders`, {
        base_currency: baseCurrency,
        quote_currency: quoteCurrency,
        buy_or_sell: buyOrSell,
        price_limit: priceLimit,
        base_amount: baseAmount,
        quote_amount: quoteAmount,
        provide_liquidity_only: provideLiquidityOnly,
        time_in_force: timeInForce,
        ttl: ttl
      })
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function cancels all open orders.
   * @returns {Promise<CancelOrdersResp>} API response.
   */
  async cancelOrders () {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    }

    try {
      return this.api.request('DELETE', `/accounts/${this.account.id}/orders`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function cancels the order with the given order id.
   * @param {{
   *  orderId: String
   * }} param0 Request parameters.
   * @returns {Promise<CancelOrderResp>} API response.
   */
  async cancelOrder ({ orderId } = {}) {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!orderId) {
      throw new SDKError(400, '[Zabo] Missing `orderId` parameter. See: https://zabo.com/docs/#cancel-an-order')
    } else if (!utils.uuidValidate(orderId)) {
      throw new SDKError(400, '[Zabo] `orderId` must be a valid UUID v4. See: https://zabo.com/docs/#cancel-an-order')
    }

    try {
      return this.api.request('DELETE', `/accounts/${this.account.id}/orders/${orderId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }
}

/**
 * @typedef {Trading} TradingAPI
 * @type {(api) => TradingAPI}
 */
module.exports = (api) => {
  return new Trading(api)
}

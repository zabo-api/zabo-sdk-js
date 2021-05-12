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
 *  ticker?: String
 *  name?: String
 *  type?: String
 *  priority?: Number
 *  logo?: String
 *  decimals?: Number
 *  supporting_providers?: [String]
 *  address?: String
 *  resource_type?: String
 * }} Currency
 *
 * @typedef {{
 *  from?: String
 *  to?: String
 *  rate?: String
 *  timestamp?: Number
 *  resource_type?: String
 * }} ExchangeRate
 *
 * @typedef {{
 *  data?: [Currency]
 *  request_id?: String
 * }} GetListCurrenciesResp
 *
 * @typedef {{
 *  request_id?: String
 * } & Currency} GetOneCurrencyResp
 *
 * @typedef {{
 *  data?: [ExchangeRate]
 *  request_id?: String
 * }} GetExchangeRatesResp
 */

/**
 * Currencies API.
 */
class Currencies {
  constructor (api) {
    /** @private */
    this.api = api
  }

  /**
   * This endpoint will return the full list of currencies available in the system.
   * Use the providers endpoint to see the currencies supported by each provider.
   * @param {{
   *  limit?: Number
   *  cursor?: String
   * }} param0 Request parameters.
   * @returns {Promise<GetListCurrenciesResp>} API response.
   */
  async getList ({ limit = 25, cursor = '' } = {}) {
    utils.validateListParameters(limit)

    try {
      return this.api.request('GET', `/currencies?limit=${limit}&cursor=${cursor}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This endpoint provides information about a specific currency.
   * @param {String} ticker 3-letter identifier for this currency or asset.
   * @returns {Promise<GetOneCurrencyResp>} API response.
   */
  async getOne (ticker) {
    if (!ticker) {
      throw new SDKError(400, '[Zabo] Missing `ticker` input. See: https://zabo.com/docs#get-specific-currency')
    }

    try {
      return this.api.request('GET', `/currencies/${ticker}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function returns a list of exchange rates for the available cryptocurrencies/assets
   * for a given fiat currency. Currently, USD is the only fiat currency available.
   * Any supported assets can be used for the tickers parameter. This parameter is optional
   * and, if left out, all supported cryptocurrencies/assets will be returned.
   * @param {{
   *  toCrypto?: Boolean
   *  limit?: Number
   *  cursor?: String
   *  tickers?: Array<String> | String
   * }} param0 Request parameters.
   * @returns {Promise<GetExchangeRatesResp>} API response.
   */
  async getExchangeRates ({ toCrypto = false, limit = 25, cursor = '', tickers = '' } = {}) {
    utils.validateListParameters(limit)

    let url = `/exchange-rates?to_crypto=${!!toCrypto}&limit=${limit}&cursor=${cursor}`

    if (tickers) {
      if (Array.isArray(tickers)) {
        tickers = tickers.join(',')
      }
      url = `${url}&tickers=${tickers}`
    }

    return this.api.request('GET', url)
  }
}

/**
 * @typedef {Currencies} CurrenciesAPI
 * @type {(api) => CurrenciesAPI}
 */
module.exports = (api) => {
  return new Currencies(api)
}

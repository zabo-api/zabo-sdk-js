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

class Currencies {
  constructor (api) {
    this.api = api
  }

  async getList ({ limit = 25, cursor = '' } = {}) {
    utils.validateListParameters(limit)

    try {
      return this.api.request('GET', `/currencies?limit=${limit}&cursor=${cursor}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

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

module.exports = (api) => {
  return new Currencies(api)
}

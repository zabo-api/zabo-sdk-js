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

const uuidValidate = require('uuid-validate')
const utils = require('../utils')
const { SDKError } = require('../err')

class Trading {
  constructor (api) {
    this.api = api
    this.account = null
  }

  _setAccount (account) {
    this.account = account
  }

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

  async getTickerInfo ({ baseCurrency, quoteCurrency } = {}) {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!baseCurrency) {
      throw new SDKError(400, '[Zabo] Missing `baseCurrency` parameter. See: https://zabo.com/docs')
    } else if (!quoteCurrency) {
      throw new SDKError(400, '[Zabo] Missing `quoteCurrency` parameter. See: https://zabo.com/docs')
    }

    try {
      return this.api.request('GET', `/accounts/${this.account.id}/tickers/${baseCurrency}-${quoteCurrency}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

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

  async getOrder ({ orderId } = {}) {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!orderId) {
      throw new SDKError(400, '[Zabo] Missing `orderId` parameter. See: https://zabo.com/docs')
    } else if (!uuidValidate(orderId, 4)) {
      throw new SDKError(400, '[Zabo] `orderId` must be a valid UUID v4. See: https://zabo.com/docs')
    }

    try {
      return this.api.request('GET', `/accounts/${this.account.id}/orders/${orderId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async createOrder ({ baseCurrency, quoteCurrency, side, price, size, funds, postOnly, timeInForce, timeToLive } = {}) {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!baseCurrency) {
      throw new SDKError(400, '[Zabo] Missing `baseCurrency` parameter. See: https://zabo.com/docs')
    } else if (!quoteCurrency) {
      throw new SDKError(400, '[Zabo] Missing `quoteCurrency` parameter. See: https://zabo.com/docs')
    }

    utils.validateEnumParameter('side', side, ['buy', 'sell'])
    utils.validateEnumParameter('timeInForce', timeInForce, ['GTC', 'GTT', 'IOC', 'FOK'], true)

    try {
      return this.api.request('POST', `/accounts/${this.account.id}/orders`, {
        base_currency: baseCurrency,
        quote_currency: quoteCurrency,
        side: side,
        price: price,
        size: size,
        funds: funds,
        post_only: postOnly,
        time_in_force: timeInForce,
        ttl: timeToLive
      })
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

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

  async cancelOrder ({ orderId } = {}) {
    if (!this.account || !this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!orderId) {
      throw new SDKError(400, '[Zabo] Missing `orderId` parameter. See: https://zabo.com/docs')
    } else if (!uuidValidate(orderId, 4)) {
      throw new SDKError(400, '[Zabo] `orderId` must be a valid UUID v4. See: https://zabo.com/docs')
    }

    try {
      return this.api.request('DELETE', `/accounts/${this.account.id}/orders/${orderId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }
}

module.exports = (api) => {
  if (api.decentralized) {
    return null
  }
  return new Trading(api)
}

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
 *
 * @description: Zabo account-related functions
 */

'use strict'

const { SDKError } = require('../err')

/**
 * @typedef {{
 *  data?: [import('./users').Balance]
 *  request_id?: String
 * }} GetAccountBalances
 */

/**
 * Accounts API.
 */
class Accounts {
  constructor (api) {
    this.api = api
    this.id = null
    this.data = null
  }

  /**
   * @private
   */
  _setAccount (account) {
    this.id = account.id
    this.data = account
  }

  async get () {
    try {
      const response = await this.api.request('GET', '/sessions')
      this._setAccount(response)

      return this.data
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async create ({ clientId, credentials, provider, origin } = {}) {
    if (!clientId) {
      throw new SDKError(
        400,
        `[Zabo] Unable to connect with the Zabo API. Make sure you have registered your app at https://zabo.com and that you entered a valid 'clientId' value.
        More details at: https://zabo.com/docs`
      )
    }
    const data = {
      client_id: clientId,
      provider_name: provider,
      credentials,
      origin
    }

    try {
      const account = await this.api.request('POST', '/accounts', data)
      this._setAccount(account)
      return account
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * Returns the user balances for the requested currencies. When requesting balances from the client,
   * the request should be made in the context of the connected account. When requesting from an
   * application server, requests should be made in the context of a user. See documentation about
   * users. Cryptocurrencies available to your app can be queried. If no currencies are specified,
   * then all available currencies will be returned.
   * @param {{
   *  tickers?: [String]
   * }} param0 Request parameters.
   * @returns {Promise<GetAccountBalances>} API response.
   */
  async getBalances ({ tickers } = {}) {
    if (!this.id) {
      throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
    }

    let url = `/accounts/${this.id}/balances`

    if (tickers) {
      if (Array.isArray(tickers)) {
        tickers = tickers.join(',')
      }
      url = `${url}?tickers=${tickers}`
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This endpoint will create and return a deposit address for the specified account.
   * If the currency is not supported by the connected provider, you will receive an 'unsupported' error.
   * See Unsupported Functions for more information.
   * @param {String} ticker Three-letter identifier for the currency this deposit address should be used for.
   * @returns {Promise<import('./users').CreateDepositAddressResp>} API response.
   */
  async createDepositAddress (ticker) {
    if (!this.id) {
      throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!ticker || typeof ticker !== 'string') {
      throw new SDKError(400, '[Zabo] Missing or invalid `ticker` parameter. See: https://zabo.com/docs#create-a-deposit-address')
    }

    const providersWithStaticDepositAddresses = [
      'metamask',
      'ledger',
      'hedera',
      'address-only',
      'binance'
    ]

    for (const provider of providersWithStaticDepositAddresses) {
      if (provider === this.data.provider.name) {
        console.warn(`[Zabo] Provider '${provider}' does not support dynamic address generation. Fallbacking to accounts.getDepositAddresses()... More details: https://zabo.com/docs#get-deposit-addresses`)
        return this.getDepositAddresses(ticker)
      }
    }

    try {
      return this.api.request('POST', `/accounts/${this.id}/deposit-addresses?ticker=${ticker}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This endpoint will retrieve all deposit addresses for the specified account.
   * If the currency is not supported by the connected provider, you will receive
   * an 'unsupported' error. See Unsupported Functions for more information.
   * @param {String} ticker Three-letter identifier for the currency this deposit address should be used for.
   * @returns {Promise<import('./users').GetDepositAddressesResp>}
   */
  async getDepositAddresses (ticker) {
    if (!this.id) {
      throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!ticker || typeof ticker !== 'string') {
      throw new SDKError(400, '[Zabo] Invalid `ticker` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    }

    try {
      return this.api.request('GET', `/accounts/${this.id}/deposit-addresses?ticker=${ticker}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }
}

/**
 * @typedef {Accounts} AccountsAPI
 * @type {(api) => AccountsAPI}
 */
module.exports = (api) => {
  return new Accounts(api)
}

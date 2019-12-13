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

const utils = require('../utils')
const { SDKError } = require('../err')

class Accounts {
  constructor(api) {
    this.api = api
    this.id = null
    this.data = null
  }

  _setAccount(account) {
    this.id = account.id
    this.data = account
  }

  async get() {
    if (utils.isNode()) {
      throw new SDKError(400, '[Zabo] Not available in the server SDK. See: https://zabo.com/docs/#get-an-account')
    }

    try {
      let response = await this.api.request('GET', `/sessions`)
      this._setAccount(response)

      return this.data
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async create({ clientId, credentials, provider, origin } = {}) {
    if (utils.isNode()) {
      throw new SDKError(400, '[Zabo] Not available in the server SDK. See: https://zabo.com/docs')
    }

    if (!clientId) {
      throw new SDKError(
        400,
        `[Zabo] Unable to connect with the Zabo API. Make sure you have registered your app at https://zabo.com and that you entered a valid 'clientId' value.
        More details at: https://zabo.com/docs`
      )
    }
    let data = {
      client_id: clientId,
      wallet_provider_name: provider,
      credentials,
      origin
    }

    return this.api.request('POST', `/accounts`, data)
  }

  async getBalances({ accountId = this.id, currencies } = {}) {
    if (!accountId) {
      if (utils.isNode()) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs/#get-a-specific-balance')
      } else {
        throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
      }
    }

    let url = `/accounts/${accountId}/balances`

    if (currencies) {
      if (Array.isArray(currencies)) {
        currencies = currencies.join(',')
      }
      url = `${url}?currencies=${currencies}`
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async createDepositAddress({ accountId = this.id, currency }) {
    if (!accountId) {
      if (utils.isNode()) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#create-a-deposit-address')
      } else {
        throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
      }
    }

    if (!currency || typeof currency !== 'string') {
      throw new SDKError(400, '[Zabo] Missing or invalid `currency` parameter. See: https://zabo.com/docs##create-a-deposit-address')
    }

    if (utils.isBrowser()) {
      const providersWithStaticDepositAddresses = [
        'metamask',
        'ledger',
        'hedera',
        'address-only',
        'binance',
      ]

      for (let provider of providersWithStaticDepositAddresses) {
        if (provider === this.data.wallet_provider.name) {
          console.warn(`[Zabo] Provider '${provider}' does not support dynamic address generation. Fallbacking to accounts.getDepositAddress()... More details: https://zabo.com/docs#get-deposit-address`)
          return this.getDepositAddresses(currency)
        }
      }
    }

    try {
      return this.api.request('POST', `/accounts/${accountId}/deposit-addresses?currency=${currency}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }

  async getDepositAddresses({ accountId = this.id, currency }) {
    if (!accountId) {
      if (utils.isNode()) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-deposit-addresses')
      } else {
        throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
      }
    }

    if (!currency || typeof currency !== 'string') {
      throw new SDKError(400, '[Zabo] Invalid `currency` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    }

    try {
      return this.api.request('GET', `/accounts/${accountId}/deposit-addresses?currency=${currency}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message)
    }
  }
}

module.exports = async (api) => {
  let accounts = new Accounts(api)
  if (api.ethereum) {
    let ethConnection = await api.ethereum.connect(api.useNode, api.useAddress)
    accounts.data = ethConnection.data
    accounts.node = ethConnection.node
    accounts.get = () => { return accounts.data }
    accounts.getBalances = ({ currencies } = {}) => { return ethConnection.getBalance(currencies) }
    accounts.createDepositAddress = () => { return { currency: 'ETH', address: accounts.data.address } }
    if (!api.sendAppCryptoData) {
      accounts.create = () => { throw new SDKError(400, '[Zabo] Not available in decentralized mode. See: https://zabo.com/docs#decentralized-mode') }
    }
    accounts.getDepositAddress = () => { return { currency: 'ETH', address: accounts.data.address } }
  }
  return accounts
}

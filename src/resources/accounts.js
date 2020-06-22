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

class Accounts {
  constructor (api) {
    this.api = api
    this.id = null
    this.data = null
  }

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

  async getBalances ({ currencies } = {}) {
    if (!this.id) {
      throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
    }

    let url = `/accounts/${this.id}/balances`

    if (currencies) {
      if (Array.isArray(currencies)) {
        currencies = currencies.join(',')
      }
      url = `${url}?currencies=${currencies}`
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async createDepositAddress (currency) {
    if (!this.id) {
      throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!currency || typeof currency !== 'string') {
      throw new SDKError(400, '[Zabo] Missing or invalid `currency` parameter. See: https://zabo.com/docs#create-a-deposit-address')
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
        return this.getDepositAddresses(currency)
      }
    }

    try {
      return this.api.request('POST', `/accounts/${this.id}/deposit-addresses?currency=${currency}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getDepositAddresses (currency) {
    if (!this.id) {
      throw new SDKError(401, '[Zabo] Account not yet connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!currency || typeof currency !== 'string') {
      throw new SDKError(400, '[Zabo] Invalid `currency` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    }

    try {
      return this.api.request('GET', `/accounts/${this.id}/deposit-addresses?currency=${currency}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }
}

module.exports = async (api) => {
  const accounts = new Accounts(api)
  if (api.ethereum) {
    const ethConnection = await api.ethereum.connect(api.useNode, api.useAddress)
    accounts.data = ethConnection.data
    accounts.node = ethConnection.node
    accounts.get = () => { return accounts.data }
    accounts.getBalances = ({ currencies } = {}) => { return ethConnection.getBalance(currencies) }
    accounts.createDepositAddress = () => { return { currency: 'ETH', address: accounts.data.address } }
    if (!api.sendAppCryptoData) {
      accounts.create = () => { throw new SDKError(400, '[Zabo] Not available in decentralized mode. See: https://zabo.com/docs') }
    }
    accounts.getDepositAddress = () => { return { currency: 'ETH', address: accounts.data.address } }
  }
  return accounts
}

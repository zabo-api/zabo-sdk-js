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

class Blockchains {
  constructor (api) {
    this.api = api
  }

  async getBlock (blockchain, blockNumber) {
    utils.validateEnumParameter('blockchain', blockchain, ['bitcoin', 'ethereum'])

    let url = `/blockchains/${blockchain}/blocks`
    if (typeof blockNumber !== 'undefined') {
      url += '/' + blockNumber
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getContract (blockchain, address) {
    utils.validateEnumParameter('blockchain', blockchain, ['ethereum'])

    if (typeof address === 'undefined') {
      throw new SDKError(400, '[Zabo] Missing `address` parameter. See: https://zabo.com/docs#get-a-smart-contract')
    }

    try {
      return this.api.request('GET', `/blockchains/${blockchain}/contracts/${address}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getTokens (blockchain, tokenName) {
    utils.validateEnumParameter('blockchain', blockchain, ['ethereum'])

    let url = `/blockchains/${blockchain}/tokens`
    if (typeof tokenName !== 'undefined') {
      url += '/' + tokenName
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getBalances (blockchain, address) {
    utils.validateEnumParameter('blockchain', blockchain, ['bitcoin', 'ethereum'])

    if (typeof address === 'undefined') {
      throw new SDKError(400, '[Zabo] Missing `address` parameter. See: https://zabo.com/docs#get-balances-for-address-or-xpub')
    }

    try {
      return this.api.request('GET', `/blockchains/${blockchain}/addresses/${address}/balances`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getTransactions (blockchain, address) {
    utils.validateEnumParameter('blockchain', blockchain, ['bitcoin', 'ethereum'])

    if (typeof address === 'undefined') {
      throw new SDKError(400, '[Zabo] Missing `address` parameter. See: https://zabo.com/docs#get-transactions-for-address-or-xpub')
    }

    try {
      return this.api.request('GET', `/blockchains/${blockchain}/addresses/${address}/transactions`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getTransaction (blockchain, transactionHash) {
    utils.validateEnumParameter('blockchain', blockchain, ['bitcoin', 'ethereum'])

    if (typeof transactionHash === 'undefined') {
      throw new SDKError(400, '[Zabo] Missing `transactionHash` parameter. See: https://zabo.com/docs#get-transaction-by-hash')
    }

    try {
      return this.api.request('GET', `/blockchains/${blockchain}/transactions/${transactionHash}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getTokenTransfers (blockchain, address) {
    utils.validateEnumParameter('blockchain', blockchain, ['ethereum'])

    if (typeof address === 'undefined') {
      throw new SDKError(400, '[Zabo] Missing `address` parameter. See: https://zabo.com/docs#get-token-transfers-for-address-or-xpub')
    }

    try {
      return this.api.request('GET', `/blockchains/${blockchain}/addresses/${address}/token-transfers`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  async getTokenTransfer (blockchain, transactionHash) {
    utils.validateEnumParameter('blockchain', blockchain, ['ethereum'])

    if (typeof transactionHash === 'undefined') {
      throw new SDKError(400, '[Zabo] Missing `transactionHash` parameter. See: https://zabo.com/docs#get-a-token-transfer-by-hash')
    }

    try {
      return this.api.request('GET', `/blockchains/${blockchain}/token-transfers/${transactionHash}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }
}

module.exports = (api) => {
  if (api.decentralized) {
    return null
  }
  return new Blockchains(api)
}

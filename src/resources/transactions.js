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
 *  direction?: 'sent' | 'received'
 *  ticker?: String
 *  provider_ticker?: String
 *  amount?: String
 *  asset_is_verified?: Boolean
 *  fiat_ticker?: String
 *  fiat_value?: String
 *  fiat_asset_is_verified?: Boolean
 *  other_parties?: [String]
 * }} Part
 *
 * @typedef {{
 *  type?: String
 *  ticker?: String
 *  provider_ticker?: String
 *  amount?: String
 *  asset_is_verified?: Boolean
 *  fiat_ticker?: String
 *  fiat_value?: String
 *  fiat_asset_is_verified?: Boolean
 *  resource_type?: String
 * }} Fee
 *
 * @typedef {{
 *  id?: String
 *  status?: String
 *  transaction_type?: String
 *  parts?: [Part]
 *  fees?: [Fee]
 *  misc?: [any]
 *  fiat_calculated_at?: Number
 *  initiated_at?: Number
 *  confirmed_at?: Number
 *  resource_type?: String
 * }} Transaction
 *
 * @typedef {{
 *  data?: [Transaction]
 *  delay?: Number
 *  last_updated_at?: Number
 *  request_id?: String
 * }} TransactionsResp
 */

/**
 * Transactions API.
 */
class Transactions {
  constructor (api) {
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
   * getOne fetches a specific transaction for the given account.
   * @param {{
   *  userId: string,
   *  accountId?: string,
   *  txId: string,
   *  ticker: string,
   * }} param0 Transaction request object.
   * @returns {Promise<Transaction>} A transaction.
   */
  async getOne ({ userId, accountId, txId } = {}) {
    if (utils.isNode()) {
      if (!userId) {
        throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!utils.uuidValidate(userId)) {
        throw new SDKError(400, '[Zabo] `userId` must be a valid UUID v4. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!accountId) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!utils.uuidValidate(accountId)) {
        throw new SDKError(400, '[Zabo] `accountId` must be a valid UUID v4. See: https://zabo.com/docs#get-a-specific-transaction')
      } else if (!txId) {
        throw new SDKError(400, '[Zabo] Missing `txId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
      }

      try {
        return this.api.request('GET', `/users/${userId}/accounts/${accountId}/transactions/${txId}`)
      } catch (err) {
        throw new SDKError(err.error_type, err.message, err.request_id)
      }
    }

    if (!this.account.id) {
      throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
    } else if (!txId) {
      throw new SDKError(400, '[Zabo] Missing `txId` parameter. See: https://zabo.com/docs#get-a-specific-transaction')
    }

    try {
      return this.api.request('GET', `/accounts/${this.account.id}/transactions/${txId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * getList fetches a list of transaction for the given account.
   * @param {{
   *  userId: String,
   *  accountId?: String,
   *  ticker?: String,
   *  limit?: Number,
   *  cursor?: String
   * }} param0 Transactions request object.
   * @returns {Promise<TransactionsResp>} An API response with transactions within `data`.
   */
  async getList ({ userId, accountId, ticker = '', limit = 25, cursor = '' } = {}) {
    utils.validateListParameters(limit)

    let url = null

    if (utils.isNode()) {
      if (!userId) {
        throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-transaction-history')
      } else if (!utils.uuidValidate(userId)) {
        throw new SDKError(400, '[Zabo] `userId` must be a valid UUID v4. See: https://zabo.com/docs#get-transaction-history')
      } else if (!accountId) {
        throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-transaction-history')
      } else if (!utils.uuidValidate(accountId)) {
        throw new SDKError(400, '[Zabo] `accountId` must be a valid UUID v4. See: https://zabo.com/docs#get-transaction-history')
      }

      url = `/users/${userId}/accounts/${accountId}/transactions?limit=${limit}&cursor=${cursor}`
      if (ticker !== '') {
        url = `${url}&ticker=${ticker}`
      }
    } else {
      if (!this.account.id) {
        throw new SDKError(400, '[Zabo] Not connected. See: https://zabo.com/docs#connecting-a-user')
      }

      url = `/accounts/${this.account.id}/transactions?limit=${limit}&cursor=${cursor}`
      if (ticker !== '') {
        url = `${url}&ticker=${ticker}`
      }
    }

    try {
      return this.api.request('GET', url)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }
}

/**
 * @typedef {Transactions} TransactionsAPI
 * @type {(api) => TransactionsAPI}
 */
module.exports = (api) => {
  return new Transactions(api)
}

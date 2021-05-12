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
 *  id?: String,
 *  name?: String
 * }} Application
 *
 * @typedef {{
 *  name?: String
 *  display_name?: String
 *  logo?: String
 *  auth_type?: String
 *  available_currencies?: [{
 *    type?: String
 *    list?: [String]
 *    resource_type?: String
 *  }]
 *  available_scopes?: [
 *    {
 *      name?: String
 *      display_name?: String
 *      description?: String
 *    }
 *  ]
 *  status?: any
 *  scopes?: [String]
 *  is_beta?: Boolean
 *  connect_notice?: String
 *  status_notice?: String
 *  resource_type?: String
 * }} Provider
 *
 * @typedef {{
 *  id?: String
 *  blockchain?: String
 *  provider?: Provider
 *  last_connected?: Number
 *  created_at?: Number
 *  updated_at?: Number
 *  resource_type?: String
 *  balances?: [Balance]
 * }} Account
 *
 * @typedef {{
 *  id?: String,
 *  accounts?: [Account]
 *  created_at?: Number
 *  updated_at?: Number
 *  resource_type?: String
 *  request_id?: String
 * }} User
 *
 * @typedef {User} CreateUserResp
 *
 * @typedef {{
 *  id?: String
 *  application?: Application
 *  accounts?: [Account]
 *  created_at?: Number
 *  updated_at?: Number
 *  resource_type?: String
 *  request_id?: String
 * }} AddAccountResp
 *
 * @typedef {AddAccountResp} RemoveAccountResp
 *
 * @typedef {User} GetOneUserResp
 *
 * @typedef {{
 *  data?: [User]
 *  total?: Number
 *  request_id?: String
 * }} GetListUsersResp
 *
 * @typedef {{
 *  ticker?: String
 *  provider_ticker?: String
 *  name?: String
 *  asset_is_verified?: Boolean
 *  asset_type?: String
 *  amount?: String
 *  decimals?: Number
 *  fiat_ticker?: String
 *  fiat_value?: String
 *  fiat_asset_is_verified?: Boolean
 *  logo?: String
 *  updated_at?: Number
 *  misc?: [String]
 *  resource_type?: String
 * }} Balance
 *
 * @typedef {{
 *  balances?: [Balance]
 *  request_id?: String
 * } & Account} GetAccountResp
 *
 * @typedef {{
 *  data?: [Balance]
 *  delay?: Number
 *  request_id?: String
 * }} GetBalancesResp
 *
 * @typedef {{
 *  asset?: import('./currencies').Currency
 *  provider_ticker?: String
 *  address?: String
 *  resource_type?: String
 *  request_id?: String
 * }} CreateDepositAddressResp
 *
 * @typedef {{
 *  data?: [
 *    {
 *      ticker?: String
 *      provider_ticker?: String
 *      address?: String
 *      resource_type?: String
 *    }
 *  ]
 *  request_id?: String
 * }} GetDepositAddressesResp
 */

class Users {
  constructor (api) {
    /** @private */
    this.api = api
  }

  /**
   * This function creates a new user for your application. A user connects their cryptocurrency
   * wallet via the Zabo Client API, and then you can create a user from your server.
   * From there, your application server can have access this user's account data.
   * @param {any} account Account data.
   * @returns {Promise<CreateUserResp>} API response.
   */
  async create (account = {}) {
    if (!account.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#create-a-user')
    } else if (!account.token) {
      throw new SDKError(400, '[Zabo] Missing `token` property in account object. See: https://zabo.com/docs#create-a-user')
    }

    try {
      return this.api.request('POST', '/users', account)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function inserts an additional account into a given user object.
   * Useful when your application makes it possible for the same user to connect with multiple providers.
   * @param {any} user The user object received from zabo.users.create() response.
   * @param {any} account The account object received when the user connected. This object must contain a valid token.
   * @returns {Promise<AddAccountResp>} API response.
   */
  async addAccount (user = {}, account = {}) {
    if (!user.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in user object. See: https://zabo.com/docs#add-account-to-existing-user')
    } else if (!account.id) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#add-account-to-existing-user')
    } else if (!account.token) {
      throw new SDKError(400, '[Zabo] Missing `token` property in account object. See: https://zabo.com/docs#add-account-to-existing-user')
    }

    try {
      return this.api.request('POST', `/users/${user.id}/accounts`, account)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function removes a defined account from a given user object. Use this function when a user
   * doesn't want to have any specific provider account linked to your application anymore.
   * @param {{ userId: String, accountId: String }} param0 The user & account IDs.
   * @returns {Promise<RemoveAccountResp>} API response.
   */
  async removeAccount ({ userId, accountId }) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `id` property in user object. See: https://zabo.com/docs#remove-account-from-user')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `id` property in account object. See: https://zabo.com/docs#remove-account-from-user')
    }

    try {
      return this.api.request('DELETE', `/users/${userId}/accounts/${accountId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function returns the user requested. The user object contains the user's unique id
   * and accounts information, including the provider used during connection with your app.
   * @param {String} id The user's ID.
   * @returns {Promise<GetOneUserResp>} API response.
   */
  async getOne (id) {
    if (!id) {
      throw new SDKError(400, '[Zabo] Missing `id` input. See: https://zabo.com/docs#get-a-user')
    }

    try {
      return this.api.request('GET', `/users/${id}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function returns all users registered with the application. You must have authorization to the users.
   * @param {{ limit?: Number, cursor?: String }} param0 Cursor location.
   * @returns {Promise<GetListUsersResp>} API response.
   */
  async getList ({ limit = 25, cursor = '' } = {}) {
    utils.validateListParameters(limit, cursor)

    try {
      return this.api.request('GET', `/users?limit=${limit}&cursor=${cursor}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This function returns the full account object for a particular user requested.
   * @param {{ userId: String, accountId: String }} param0 The user & account IDs.
   * @returns {Promise<GetAccountResp>} API response.
   */
  async getAccount ({ userId, accountId } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-a-user-account')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-a-user-account')
    }

    try {
      return this.api.request('GET', `/users/${userId}/accounts/${accountId}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * Returns the user balances for the requested currencies. When requesting balances from the client,
   * the request should be made in the context of the connected account. When requesting from an application server,
   * requests should be made in the context of a user. Cryptocurrencies available to your app can be queried
   * using the currencies function documented below. If no currencies are specified, then all
   * available currencies will be returned.
   * @param {{
   *  userId?: String
   *  accountId?: String
   *  tickers?: String
   * }} param0 Request parameters.
   * @returns {Promise<GetBalancesResp>} API response.
   */
  async getBalances ({ userId, accountId, tickers } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-a-specific-balance')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-a-specific-balance')
    }

    let url = `/users/${userId}/accounts/${accountId}/balances`

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
   * This endpoint will create and return a deposit address for the specified account. If the currency
   * is not supported by the connected provider, you will receive an 'unsupported' error.
   * @param {{
   *  userId: String
   *  accountId: String
   *  ticker: String
   * }} param0 Request parameters.
   * @returns {Promise<CreateDepositAddressResp>} API response.
   */
  async createDepositAddress ({ userId, accountId, ticker } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#create-a-deposit-address')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#create-a-deposit-address')
    } else if (!ticker || typeof ticker !== 'string') {
      throw new SDKError(400, '[Zabo] Missing or invalid `ticker` parameter. See: https://zabo.com/docs#create-a-deposit-address')
    }

    try {
      return this.api.request('POST', `/users/${userId}/accounts/${accountId}/deposit-addresses?ticker=${ticker}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }

  /**
   * This endpoint will retrieve all deposit addresses for the specified account. If the currency
   * is not supported by the connected provider, you will receive an 'unsupported' error.
   * @param {{
   *  userId: String
   *  accountId: String
   *  ticker: String
   * }} param0 Request parameters.
   * @returns {Promise<GetDepositAddressesResp>} API response.
   */
  async getDepositAddresses ({ userId, accountId, ticker } = {}) {
    if (!userId) {
      throw new SDKError(400, '[Zabo] Missing `userId` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    } else if (!accountId) {
      throw new SDKError(400, '[Zabo] Missing `accountId` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    } else if (!ticker || typeof ticker !== 'string') {
      throw new SDKError(400, '[Zabo] Missing or invalid `ticker` parameter. See: https://zabo.com/docs#get-deposit-addresses')
    }

    try {
      return this.api.request('GET', `/users/${userId}/accounts/${accountId}/deposit-addresses?ticker=${ticker}`)
    } catch (err) {
      throw new SDKError(err.error_type, err.message, err.request_id)
    }
  }
}

/**
 * @typedef {Users} UsersAPI
 * @type {(api) => UsersAPI}
 */
module.exports = (api) => {
  return new Users(api)
}

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
 *   limit: Number
 *   has_more: Boolean
 *   self_uri: String
 *   next_uri: String
 * }} ListCursor
 *
 * @typedef {{
 *  hex: String
 *  nonce?: Number
 *  name?: String
 * }} Address
 *
 * @typedef {{
 *  contract: {
 *    address: String
 *  },
 *  symbol?: String
 *  name?: String
 *  decimals: Number
 *  total_supply: String
 *  is_erc20: Boolean
 * }} Token
 *
 * @typedef {{
 *  number?: Number
 *  hash?: String
 *  size?: Number
 *  gas_limit?: Number
 *  gas_used?: Number
 *  transaction_count?: Number
 *  timestamp?: Number
 *  version?: Number
 *  nonce?: String
 * }} Block
 *
 * @typedef {{
 *  address?: Address
 *  bytecode?: String
 * }} Contract
 *
 * @typedef GetTokensResp
 * @property {ListCursor} list_cursor
 * @property {[{
 *   contract?: {
 *     address?: Address
 *   }
 * }]} data
 *
 * @typedef {{
 *   token?: Token,
 *   address?: String,
 *   balance?: String
 * }} Balance
 *
 * @typedef {{
 *  data?: [Balance] | Number
 * }} GetBalancesResp
 *
 * @typedef {{
 *  hash?: String
 *  block_number?: Number
 *  from_address?: Address
 *  to_address?: Address
 *  value?: String
 *  gas?: Number
 *  gas_price?: String
 *  gas_used?: Number
 *  input?: String
 *  status?: Number
 * }} ETHTransaction
 *
 * @typedef {{
 *  node: {
 *    output_script?: String
 *    output_script_type?: String
 *    addresses?: [{
 *      address?: Address
 *      index?: Number
 *    }],
 *    input_script?: String
 *    input_sequence?: String
 *    required_signatures?: Number
 *    output_value?: Number
 *  },
 *  output_transaction?: {
 *    hash?: String
 *    block_number?: Number
 *    outputs?: any
 *    inputs?: any
 *    size?: Number
 *    lock_time?: Number
 *    is_coinbase?: Boolean
 *  },
 *  output_index?: Number
 *  input_transaction?: any
 *  input_index?: any
 * }} BTCNode
 *
 * @typedef {{
 *  outputs?: [BTCNode]
 *  inputs?: [BTCNode]
 * }} BTCTransaction
 *
 * @typedef {ETHTransaction & BTCTransaction} TransactionData
 *
 * @typedef GetTransactionsResp
 * @property {ListCursor} list_cursor
 * @property {[TransactionData]} data
 *
 * @typedef GetTransactionResp
 * @property {TransactionData} data
 *
 * @typedef GetTokenTransfersResp
 * @property {ListCursor} list_cursor
 * @property {[{
 *  transaction: ETHTransaction,
 *  token: Token,
 *  from_address: Address,
 *  to_address: Address,
 *  value: String
 * }]} data
 *
 * @typedef GetTokenTransferResp
 * @property {[{
 *  transaction: ETHTransaction,
 *  token: Token,
 *  from_address: Address,
 *  to_address: Address,
 *  value: String
 * }]} data
 */

class Blockchains {
  constructor (api) {
    this.api = api
  }

  /**
   * Fetches information regarding the requested block number.
   * If the endpoint is called without a block number, then the latest block Zabo has will be returned.
   * **NOTE:** Zabo lags the head of the blockchain by 10 blocks.
   * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
   * @param {Number} blockNumber Block number.
   * @returns {Promise<Block>} API response.
   */
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

  /**
   * This function returns the address and bytecode for the contract at a given address.
   * The address is required, and there must a smart contract deployed at the given address.
   * @param {('ethereum' | {})} blockchain The blockchain name.
   * @param {String} address The address for the contract.
   * @returns {Promise<Contract>} API response.
   */
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

  /**
   * This function returns a list of tokens on the Ethereum blockchain in general,
   * or a specific token if the name is provided.
   * Names are not unique so, if a name is provided in the path, a list is still
   * returned for all tokens that share the same name.
   * **NOTE:** The name is case-sensitive!
   * @param {'ethereum' | {}} blockchain The blockchain name.
   * @param {String} tokenName The name of the token.
   * @returns {Promise<GetTokensResp>} API response.
   */
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

  /**
   * This function returns a list of balances of the assets which the given address
   * or extended public key holds. If the response is for a Bitcoin network request,
   * then the data response is simply the address', or xpub key's, balance in satoshis.
   * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
   * @param {String} address The blockchain address.
   * @returns {Promise<GetBalancesResp>} API response.
   */
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

  /**
   * This function returns a list of transactions executed by the given address or extended public key.
   * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
   * @param {String} address The blockchain address.
   * @returns {Promise<GetTransactionsResp>} API response.
   */
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

  /**
   * This function returns a single transaction object related to the hash included in the request.
   * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
   * @param {String} transactionHash The transaction hash.
   * @returns {Promise<GetTransactionResp>} API response.
   */
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

  /**
   * This function returns a list of token transfers directly involving the given address or extended public key.
   * @param {'ethereum' | {}} blockchain The blockchain name.
   * @param {String} address The blockchain address.
   * @returns {Promise<GetTokenTransfersResp>} API response.
   */
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

  /**
   * This function returns the token transfers which executed as a result of the given transaction hash.
   * @param {'ethereum' | {}} blockchain The blockchain name.
   * @param {String} transactionHash The transaction hash.
   * @returns {Promise<GetTokenTransferResp>} API response.
   */
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
  return new Blockchains(api)
}

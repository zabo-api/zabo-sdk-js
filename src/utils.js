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

const crypto = require('crypto')
const bigInt = require('big-integer')
const uuidValidate = require('uuid-validate')
const { SDKError } = require('./err')

const ErrorMessages = {
  invalidLimit: '[Zabo] Values for `limit` must be 50 or below. See: https://zabo.com/docs#pagination',
  invalidUUID: '[Zabo] `cursor` must be a valid UUID version 4. See: https://zabo.com/docs#pagination',
  invalidAddress: '[Zabo] Invalid Ethereum address provided.',
  internalError: '[Zabo] Internal SDK Error. Please note the time and let us know!',
  invalidCurrency: '[Zabo] Invalid currency provided for Ethereum function. Must be ETH or an ERC20 token.',
  internalErrorTypes: {
    badRequestType: 'bad request type',
    badFunctionHash: 'invalid function bytes',
    invalidDecimals: 'invalid decimals',
    invalidZeroDecimalAmount: 'invalid amount provided for 0 decimal currency',
    invalidERC20Currency: 'currency not ERC20',
    invalidAmount: 'invalid amount string given'
  }
}

function generateHMACSignature (secretKey, url, body, timestamp) {
  const text = timestamp + url + body
  return crypto.createHmac('sha256', secretKey).update(text).digest('hex')
}

function getZaboSession () {
  return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent('zabosession').replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null
}

function validateListParameters (limit, cursor) {
  if (limit && limit > 50) {
    throw new SDKError(400, ErrorMessages.invalidLimit)
  }
  if (cursor && !uuidValidate(cursor, 4)) {
    throw new SDKError(400, ErrorMessages.invalidUUID)
  }
}

function isValidNodeUrl (nodeUrl) {
  if (!nodeUrl) {
    return false
  }

  if (isBrowser()) {
    const u = new URL(nodeUrl)
    return u.protocol && u.host
  }

  return nodeUrl.includes('.ipc')
}

function getTxObjectForEthereumRequest ({ requestType, toAddress, currency, amount, options = {} }) {
  switch (requestType) {
    case 'transfer':
      return _deriveEthereumTxForTransfer({ toAddress, currency, amount, options })
    case 'balanceOf':
      return _deriveEthereumTxForBalanceRequest({ userAddress: toAddress, currency })
    default:
      throw new SDKError(500, ErrorMessages.internalError + ` [getDataObjectForEthereumRequest: ${ErrorMessages.internalErrorTypes.badRequestType}]`)
  }
}

function _getERC20FunctionBytes (func) {
  switch (func) {
    case 'transfer':
      return '0xa9059cbb'
    case 'balanceOf':
      return '0x70a08231'
    default:
      throw new SDKError(500, ErrorMessages.internalError + ` [_getERC20FunctionBytes: ${ErrorMessages.internalErrorTypes.badFunctionHash}]`)
  }
}

function _changeFloatToInt (amount, decimals) {
  if (decimals < 0) {
    throw new SDKError(500, ErrorMessages.internalError + ` [_changeFloatToInt: ${ErrorMessages.internalErrorTypes.invalidDecimals}]`)
  }
  const strArray = amount.split('.')
  const strArrayLen = strArray.length
  if (strArrayLen > 2) {
    throw new SDKError(500, ErrorMessages.internalError + ` [_changeFloatToInt: ${ErrorMessages.internalErrorTypes.invalidAmount}]`)
  }
  // If 0 decimal places specified, then there should be 0 on the right side.
  if (strArrayLen > 1 && strArray[1].length > decimals && Number(decimals) === 0) {
    throw new SDKError(500, ErrorMessages.internalError + ` [_changeFloatToInt: ${ErrorMessages.internalErrorTypes.invalidZeroDecimalAmount}]`)
  }
  if (strArrayLen > 1 && strArray[1].length > decimals + 1) {
    // If providing fractional currency, we will slice the fraction of
    strArray[1] = strArray[1].slice(0, decimals)
  }

  if (strArrayLen === 1 && decimals !== 0) {
    return strArray[0] + '0'.padEnd(decimals, 0)
  }
  return strArray[0] + strArray[1].padEnd(decimals, 0)
}

function _deriveEthereumTxForTransfer ({ toAddress, amount, currency, options }) {
  let gasPrice
  if (options.gasPrice) {
    gasPrice = '0x' + bigInt(options.gasPrice).toString(16)
  } else {
    // 21 gwei
    gasPrice = '0x4e3b29200'
  }
  if (currency.ticker.toUpperCase() === 'ETH') {
    const txObject = {
      value: '0x' + bigInt(_changeFloatToInt(amount, 18)).toString(16),
      // 21000
      gasLimit: '0x5208',
      gasPrice: gasPrice,
      to: toAddress
    }
    return txObject
  } else if (currency.type === 'ERC20') {
    const strippedToAddress = toAddress.replace(/^0x/, '')
    if (strippedToAddress.length !== 40) {
      throw new SDKError(400, ErrorMessages.invalidAddress)
    }
    let gasLimit
    if (options.gasLimit) {
      gasLimit = '0x' + bigInt(options.gasLimit).toString(16)
    } else {
      // 250000
      gasLimit = '0x3d090'
    }
    const txObject = {
      to: currency.address,
      value: '0x00',
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      data: _getERC20FunctionBytes('transfer') +
        strippedToAddress.padStart(64, 0) +
        bigInt(_changeFloatToInt(amount, currency.decimals)).toString(16).padStart(64, 0)
    }
    return txObject
  }
  throw new SDKError(400, ErrorMessages.invalidCurrency)
}

function _deriveEthereumTxForBalanceRequest ({ currency, userAddress }) {
  if (currency.type !== 'ERC20') {
    throw new SDKError(500, ErrorMessages.internalError + ` [_deriveEthereumDataForBalanceRequest: ${ErrorMessages.internalErrorTypes.invalidERC20Currency}]`)
  }
  const strippedToAddress = userAddress.replace(/^0x/, '')
  if (strippedToAddress.length !== 40) {
    throw new SDKError(400, ErrorMessages.invalidAddress)
  }
  const txObject = {
    to: currency.address,
    data: _getERC20FunctionBytes('balanceOf') +
      strippedToAddress.padStart(64, 0)
  }
  return txObject
}

const isBrowser = new Function("return typeof window !== 'undefined'") // eslint-disable-line
const isNode = new Function("return typeof global !== 'undefined'") // eslint-disable-line
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = {
  generateHMACSignature,
  getZaboSession,
  validateListParameters,
  getTxObjectForEthereumRequest,
  isBrowser,
  isNode,
  sleep,
  isValidNodeUrl,
  ErrorMessages
}

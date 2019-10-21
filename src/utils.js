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
const url = require('url')
const bigInt = require("big-integer")
const uuidValidate = require('uuid-validate')
const qrcode = require('qrcode-generator')
const { SDKError } = require('./err')

const ErrorMessages = {
  invalidLimit: '[Zabo] Values for `limit` must be 50 or below. See: https://zabo.com/docs#about-the-api',
  invalidUUID: '[Zabo] `cursor` must be a valid UUID version 4. See: https://zabo.com/docs#about-the-api',
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

function generateHMACSignature(secretKey, url, body, timestamp) {
  let text = timestamp + url + body
  return crypto.createHmac('sha256', secretKey).update(text).digest('hex')
}

function getZaboSession() {
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent('zabosession').replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
}

function validateListParameters(limit, cursor) {
  if (limit && limit > 50) {
    throw new SDKError(400, ErrorMessages.invalidLimit)
  }
  if (cursor && !uuidValidate(cursor, 4)) {
    throw new SDKError(400, ErrorMessages.invalidUUID)
  }
}

function createQRCode(url) {
  let maxWindowHeight = 600
  let maxQrcodeHeight = maxWindowHeight - 380
  let qrLevels = ['L', 'M']
  let qrModulesByVersion = {
    1: 21,
    2: 25,
    3: 29,
    4: 33,
    5: 37,
    6: 41,
    7: 45,
    8: 49,
    9: 53,
    10: 57
  }
  let qrMargin = 4
  for (let levelIndex in qrLevels) {
    for (let typeNum = 8; typeNum <= 10; typeNum++) {
      let qr_cellsize = Math.floor(
        maxQrcodeHeight / qrModulesByVersion[typeNum]
      )
      try {
        let qr = qrcode(typeNum, qrLevels[levelIndex])
        qr.addData(url)
        qr.make()
        return qr.createImgTag(qr_cellsize, qrMargin)
      } catch (e) {
        console.log(e)
      }
    }
  }
}

function isValidNodeUrl(nodeUrl) {
  if (!nodeUrl) {
    return false
  }
  const obj = url.parse(nodeUrl)
  return obj.protocol && obj.host
}

function getDataObjectForEthereumRequest({ requestType, address, currency, amount, options = {} }) {
  switch (requestType) {
    case "transfer":
      return _deriveEthereumDataForTransfer({ toAddress: address, currency, amount, options })
    case "balanceOf":
      return _deriveEthereumDataForBalanceRequest({ userAddress: address, currency })
    default:
      throw new SDKError(500, ErrorMessages.internalError + ` [getDataObjectForEthereumRequest: ${ErrorMessages.internalErrorTypes.badRequestType}]`)
  }
}

function _getERC20FunctionBytes(func) {
  switch (func) {
    case "transfer":
      return "0xa9059cbb"
    case "balanceOf":
      return "0x70a08231"
    default:
      throw new SDKError(500, ErrorMessages.internalError + ` [_getERC20FunctionBytes: ${ErrorMessages.internalErrorTypes.badFunctionHash}]`)
  }
}

function _changeFloatToInt(amount, decimals) {
  if (decimals < 0) {
    throw new SDKError(500, ErrorMessages.internalError + ` [_changeFloatToInt: ${ErrorMessages.internalErrorTypes.invalidDecimals}]`)
  }
  let strArray = amount.split(".")
  if (strArray.length > 2) {
    throw new SDKError(500, ErrorMessages.internalError + ` [_changeFloatToInt: ${ErrorMessages.internalErrorTypes.invalidAmount}]`)
  }
  // If 0 decimal places specified, then there should be 0 on the right side.
  if (strArray.length > 1 && strArray[1].length > decimals && decimals == 0) {
    throw new SDKError(500, ErrorMessages.internalError + ` [_changeFloatToInt: ${ErrorMessages.internalErrorTypes.invalidZeroDecimalAmount}]`)
  }
  if (strArray.length > 1 && strArray[1].length > decimals + 1) {
    // If providing fractional currency, we will slice the fraction of
    strArray[1] = strArray[1].slice(0, decimals)
  }
  return strArray[0] + strArray[1].padEnd(decimals, 0)
}

function _deriveEthereumDataForTransfer({ toAddress, amount, currency, options }) {
  let gasPrice
  if (options.gasPrice) {
    gasPrice = "0x" + bigInt(options.gasPrice).toString(16)
  } else {
    // 21 gwei
    gasPrice = "0x4e3b29200"
  }
  if (currency.ticker === 'ETH') {
    let dataObject = {
      value: "0x" + bigInt(_changeFloatToInt(amount, currency.decimals)).toString(16),
      // 21000
      gasLimit: "0x5208",
      gasPrice: gasPrice,
      data: ""
    }
    return dataObject
  } else if (currency.type === 'ERC20') {
    let strippedToAddress = toAddress.replace(/^0x/, '')
    if (strippedToAddress.length !== 40) {
      throw new SDKError(400, ErrorMessages.invalidAddress)
    }
    let gasLimit
    if (options.gasLimit) {
      gasLimit = "0x" + bigInt(options.gasLimit).toString(16)
    } else {
      // 250000
      gasLimit = "0x3d090"
    }
    let dataObject = {
      value: "0x00",
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      data: _getERC20FunctionBytes('transfer') +
        strippedToAddress.padStart(64, 0) +
        bigInt(_changeFloatToInt(amount, currency.decimals)).toString(16).padStart(64, 0)
    }
    return dataObject
  }
  throw new SDKError(400, ErrorMessages.invalidCurrency)
}

function _deriveEthereumDataForBalanceRequest({ currency, userAddress }) {
  if (currency.type !== 'ERC20') {
    throw new SDKError(500, ErrorMessages.internalError + ` [_deriveEthereumDataForBalanceRequest: ${ErrorMessages.internalErrorTypes.invalidERC20Currency}]`)
  }
  let strippedToAddress = userAddress.replace(/^0x/, '')
  if (strippedToAddress.length !== 40) {
    throw new SDKError(400, ErrorMessages.invalidAddress)
  }
  let dataObject = {
    data: _getERC20FunctionBytes('balanceOf') +
      strippedToAddress.padStart(64, 0)
  }
  return dataObject
}

const isBrowser = new Function("return typeof window !== 'undefined'")
const isNode = new Function("return typeof global !== 'undefined'")

module.exports = {
  generateHMACSignature,
  getZaboSession,
  validateListParameters,
  createQRCode,
  getDataObjectForEthereumRequest,
  isBrowser,
  isNode,
  isValidNodeUrl,
  ErrorMessages
}

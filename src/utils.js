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
const uuidValidate = require('uuid-validate')
const qrcode = require('qrcode-generator')
const { SDKError } = require('./err')

function generateHMACSignature(secretKey, url, body, timestamp) {
  let text = timestamp + url + body
  return crypto.createHmac('sha256', secretKey).update(text).digest('hex')
}

function getZaboSession() {
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent('zabosession').replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
}

function validateListParameters(limit, cursor) {
  if (limit && limit > 50) {
    throw new SDKError(400, '[Zabo] Values for `limit` must be 50 or below. See: https://zabo.com/docs#about-the-api')
  }
  if (cursor && !uuidValidate(cursor, 4)) {
    throw new SDKError(400, '[Zabo] `cursor` must be a valid UUID version 4. See: https://zabo.com/docs#about-the-api')
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

const isBrowser = new Function("return typeof window !== 'undefined'")
const isNode = new Function("return typeof global !== 'undefined'")

module.exports = {
  generateHMACSignature,
  getZaboSession,
  validateListParameters,
  createQRCode,
  isBrowser,
  isNode
}

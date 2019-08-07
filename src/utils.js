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

const isBrowser = new Function("return typeof window !== 'undefined'")
const isNode = new Function("return typeof global !== 'undefined'")

module.exports = {
  generateHMACSignature,
  getZaboSession,
  validateListParameters,
  isBrowser,
  isNode
}

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

function generateHMACSignature (secretKey, url, body, timestamp) {
  const text = timestamp + url + body
  return crypto.createHmac('sha256', secretKey).update(text).digest('hex')
}

function getZaboSession () {
  return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent('zabosession').replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null
}

function validateListParameters (limit, cursor) {
  if (limit && limit > 50) {
    throw new SDKError(400, '[Zabo] Values for `limit` must be 50 or below. See: https://zabo.com/docs#pagination')
  }
  if (cursor && !uuidValidate(cursor, 4)) {
    throw new SDKError(400, '[Zabo] `cursor` must be a valid UUID version 4. See: https://zabo.com/docs#pagination')
  }
}

function validateEnumParameter (name, value, options, optional = false) {
  if (!optional && typeof value === 'undefined') {
    throw new SDKError(400, `[Zabo] Missing \`${name}\` parameter.`)
  } else if (!options.includes(value)) {
    throw new SDKError(400, `[Zabo] Invalid \`${name}\` parameter. Available options: "${options.join('", "')}".`)
  }
}

function createPaginator (payload, api) {
  const { list_cursor = {}, ...data } = payload || {}

  function Paginator (obj) {
    Object.assign(this, obj || {})
  }

  Paginator.prototype.hasMore = list_cursor.has_more
  Paginator.prototype.limit = list_cursor.limit
  Paginator.prototype.next = async function () {
    if (list_cursor.has_more && list_cursor.next_uri) {
      return api.request('GET', list_cursor.next_uri)
    }
    return new Paginator()
  }

  return new Paginator(data)
}

function sleep (milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const isBrowser = new Function("return typeof window !== 'undefined'") // eslint-disable-line
const isNode = new Function("return typeof global !== 'undefined'") // eslint-disable-line

module.exports = {
  generateHMACSignature,
  getZaboSession,
  validateListParameters,
  validateEnumParameter,
  createPaginator,
  sleep,
  isBrowser,
  isNode
}

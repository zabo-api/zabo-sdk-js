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

const createHmac = require('create-hmac')
const { SDKError } = require('./err')

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function generateHMACSignature (secretKey, url, body, timestamp) {
  const text = timestamp + url + body
  return createHmac('sha256', secretKey).update(text).digest('hex')
}

function setCookie (name, value, expires, path) {
  const valueStr = value ? encodeURIComponent(value) : ''
  const expiresStr = expires ? ('; expires=' + expires) : ''
  const pathStr = '; path=' + (path || '/')
  document.cookie = encodeURIComponent(name) + '=' + valueStr + expiresStr + pathStr
}

function getCookie (name) {
  const regexp = new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(name).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$')
  return decodeURIComponent(document.cookie.replace(regexp, '$1')) || null
}

function deleteCookie (name, path) {
  setCookie(name, null, 'Thu, 01 Jan 1970 00:00:01 GMT', path)
}

function getZaboSession () {
  return getCookie('zabosession')
}

function uuidValidate (uuid) {
  if (typeof uuid !== 'string') {
    return false
  }

  uuid = uuid.toLowerCase()

  if (!uuidPattern.test(uuid)) {
    return false
  }

  switch (uuid.charAt(14) | 0) {
    case 1:
    case 2:
      return true
    case 3:
    case 4:
    case 5:
      return ['8', '9', 'a', 'b'].indexOf(uuid.charAt(19)) !== -1
    default:
      return false
  }
}

function validateListParameters (limit, cursor) {
  if (limit && limit > 50) {
    throw new SDKError(400, '[Zabo] Values for `limit` must be 50 or below. See: https://zabo.com/docs#pagination')
  }
  if (cursor && !uuidValidate(cursor)) {
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

const isBrowser = () => {
  return (typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]')
}

const isReactNative = () => {
  return typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
}

const isNode = () => {
  return typeof global !== 'undefined' && ({}).toString.call(global) === '[object global]'
}

const getUrlParam = (name, url) => {
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

module.exports = {
  generateHMACSignature,
  setCookie,
  getCookie,
  deleteCookie,
  getZaboSession,
  uuidValidate,
  validateListParameters,
  validateEnumParameter,
  createPaginator,
  sleep,
  isBrowser,
  isNode,
  isReactNative,
  getUrlParam
}

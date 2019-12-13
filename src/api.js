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
 *
 * @description: Zabo API communication library
 */

'use strict'

const axios = require('axios')
const constants = require('./constants')
const utils = require('./utils')
const resources = require('./resources')

const { SDKError } = require('./err')

// ListCursor class definition
class ListCursor extends Array {
  #api
  #list
  #cursor

  constructor({ data, list_cursor } = {}, api) {
    super(...data)
    this.#api = api
    this.#list = data
    this.#cursor = list_cursor
  }

  get hasMore () {
    return this.#cursor.has_more
  }

  get limit () {
    return this.#cursor.limit
  }

  next () {
    if (this.hasMore && this.#cursor.next_uri) {
      return this.#api.request('GET', this.#cursor.next_uri)
    }
    return new ListCursor({ data: [], list_cursor: this.#cursor })
  }
}

// Main API class definition
class API {
  constructor(options) {
    Object.assign(this, options)
    if (!this.env) {
      throw new SDKError(
        400, `[Zabo] Please provide an 'env' value when initializing Zabo. More details at: https://zabo.com/docs`
      )
    }
    let urls = constants(this.baseUrl, this.connectUrl)[this.env]
    this.baseUrl = urls.API_BASE_URL
    this.axios = axios.create()
    this.axios.defaults.baseURL = this.baseUrl

    if (utils.isNode()) {
      this.axios.defaults.headers.common['X-Zabo-Key'] = this.apiKey
      this.resources = resources(this, true)
    } else {
      this.interfaces = {}
      this.connectUrl = urls.CONNECT_BASE_URL
      this._setEventListeners()
      this.resources = resources(this, false)
    }
  }

  async connect({ width = 540, height = 960 } = {}) {
    let appId = null

    if (utils.isNode()) {
      try {
        let res = await this.request('GET', '/applications/id')
        appId = res.id

        if (!appId) {
          throw new SDKError(500, '[Zabo] Something went wrong on our end. Please note the time and let us know')
        }

        this.resources.applications.setId(appId)
        return appId
      } catch (err) {
        throw err
      }
    } else {
      this.isWaitingForConnector = true
      const url = `${this.connectUrl}/connect?client_id=${this.clientId}&origin=${encodeURIComponent(window.location.host)}&zabo_env=${this.env}&zabo_version=${process.env.PACKAGE_VERSION}`
      this.connector = window.open(url.trim(), 'Zabo Connect', `width=${width},height=${height},resizable,scrollbars=yes,status=1`)
      this._watchConnector()
    }
  }

  async request(method, path, data, isPublic = false) {
    if (this.decentralized && !this.sendAppCryptoData) {
      throw new SDKError(403, '[Zabo] Cannot send API requests while running Zabo SDK on decentralized mode')
    }

    let request = this._buildRequest(method, path, data, isPublic)

    try {
      let response = await this.axios(request)

      if (response.data && response.data.list_cursor) {
        return new ListCursor(response.data, this)
      }
      return response.data
    } catch (err) {
      if (err.response) {
        throw new SDKError(err.response.status, err.response.data.message)
      }
      throw new SDKError(500, err.message)
    }
  }

  _buildRequest(method, path, data, isPublic) {
    let timestamp = Date.now()
    let url = this.baseUrl + path
    let body = data ? JSON.stringify(data) : ''
    let headers = {}

    if (utils.isNode()) {
      let signature = utils.generateHMACSignature(this.secretKey, url, body, timestamp)
      headers = {
        'X-Zabo-Sig': signature,
        'X-Zabo-Timestamp': timestamp
      }
    } else if (!isPublic) {
      headers = { 'Authorization': 'Bearer ' + utils.getZaboSession() }
    }
    method = method.toLowerCase()

    return { method, url, data, headers }
  }

  _setEventListeners() {
    window.addEventListener('message', this._onPostMessage.bind(this), false)
  }

  _watchConnector() {
    const interval = setInterval(() => {
      if (this.isWaitingForConnector) {
        if (this.connector.closed) {
          this.isWaitingForConnector = false

          if (this._onError) {
            this._onError({ error_type: 400, message: "[Zabo] Error in the connection process: Connection closed" })
          }
        }
      } else {
        clearInterval(interval)
      }
    }, 1000)
  }

  _onPostMessage(event) {
    if (event.data.zabo) {
      this.isWaitingForConnector = false
      if (event.origin !== this.connectUrl) {
        throw new SDKError(401, '[Zabo] Unauthorized attempt to call SDK from origin: ' + event.origin + '. Call can only come from: ' + this.connectUrl)
      }
    }

    if (event.data.zabo && event.data.eventName == 'connectSuccess') {
      if (event.data.account && event.data.account.token) {
        this._setSession({
          key: 'zabosession',
          value: event.data.account.token,
          exp_time: event.data.account.exp_time
        })
      }

      if (event.data.account.wallet_provider_name == 'metamask') {
        const Metamask = require('./interfaces/Metamask')

        if (Metamask.isSupported()) {
          this.interfaces.metamask = new Metamask(this)
          this.interfaces.metamask.onConnect(event.data.account)
        } else {
          if (this._onError) {
            this._onError({ error_type: 400, message: "[Zabo] Connection attempted with MetaMask, but MetaMask not available." })
          } else {
            throw new SDKError(400, "[Zabo] Connection attempted with MetaMask, but MetaMask not available.")
          }
        }
      } else if (event.data.account.wallet_provider_name == 'ledger') {
        const Ledger = require('./interfaces/Ledger')

        if (Ledger.isSupported()) {
          this.interfaces.ledger = new Ledger(this)
          this.interfaces.ledger.onConnect(event.data.account)
        } else {
          if (this._onError) {
            this._onError({ error_type: 400, message: "[Zabo] Connection attempted with Ledger, but Ledger not available." })
          } else {
            throw new SDKError(400, "[Zabo] Connection attempted with Ledger, but Ledger not available.")
          }
        }
      }

      if (this.resources.accounts && this.resources.transactions) {
        this.resources.accounts._setAccount(event.data.account)
        this.resources.transactions._setAccount(event.data.account)
      }

      if (this._onConnection) {
        this._onConnection(event.data.account)
      }
    }

    if (event.data.zabo && event.data.eventName == 'connectError') {
      if (this._onError) {
        this._onError({ error_type: 400, message: "[Zabo] Error in the connection process: " + event.data.error.message })
      } else {
        throw new SDKError(400, "[Zabo] Error in the connection process: " + event.data.error.message)
      }
    }
  }

  _setSession(cookie) {
    let sExpires = "; expires=" + cookie.exp_time
    document.cookie = encodeURIComponent(cookie.key) + "=" + encodeURIComponent(cookie.value) + sExpires
    return true;
  }
}

// Export API class
module.exports = API

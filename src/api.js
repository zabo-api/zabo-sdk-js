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

// Main API class definition
class API {
  constructor (options) {
    Object.assign(this, options)

    if (!this.env) {
      throw new SDKError(
        400, '[Zabo] Please provide an \'env\' value when initializing Zabo. More details at: https://zabo.com/docs'
      )
    }

    const urls = constants(this.baseUrl, this.connectUrl)[this.env]
    this.baseUrl = urls.API_BASE_URL
    this.axios = axios.create()
    this.axios.defaults.baseURL = this.baseUrl

    if (utils.isNode()) {
      this.axios.defaults.headers.common['X-Zabo-Key'] = this.apiKey
      resources(this, true).then(resources => { this.resources = resources })
    } else {
      this.connectUrl = urls.CONNECT_BASE_URL
      resources(this, false).then(resources => { this.resources = resources })
    }

    this._onMessage = this._onMessage.bind(this)
  }

  async connect ({ provider, width = 540, height = 960 } = {}) {
    let appId = null

    if (utils.isNode()) {
      const res = await this.request('GET', '/teams/id')
      appId = res.id

      if (!appId) {
        throw new SDKError(500, '[Zabo] Something went wrong on our end. Please note the time and let us know')
      }

      this.resources.teams.setId(appId)
      return appId
    } else {
      const teamSession = await this.resources.teams.getSession()

      let url = `${this.connectUrl}/connect`
      url += (provider && typeof provider === 'string') ? `/${provider}` : ''
      url += `?client_id=${this.clientId}`
      url += `&origin=${encodeURIComponent(window.location.host)}`
      url += `&zabo_env=${this.env}`
      url += `&zabo_version=${process.env.PACKAGE_VERSION}`

      if (teamSession) {
        url += `&otp=${teamSession.one_time_password}`
      }

      this.connector = window.open(url, 'Zabo Connect', `width=${width},height=${height},resizable,scrollbars=yes,status=1`)
      this._watchConnector(teamSession)
    }
  }

  async request (method, path, data, isPublic = false) {
    if (this.decentralized && !this.sendAppCryptoData) {
      throw new SDKError(403, '[Zabo] Cannot send API requests while running Zabo SDK on decentralized mode')
    }

    const request = this._buildRequest(method, path, data, isPublic)

    try {
      const response = await this.axios(request)

      if (response.data && response.data.list_cursor) {
        return new utils.ListCursor(response.data, this)
      }
      return response.data
    } catch (err) {
      if (err.response) {
        throw new SDKError(err.response.status, err.response.data.message)
      }
      throw new SDKError(500, err.message)
    }
  }

  _buildRequest (method, path, data, isPublic) {
    const timestamp = Date.now()
    const url = this.baseUrl + path
    const body = data ? JSON.stringify(data) : ''
    let headers = {}

    if (utils.isNode()) {
      const signature = utils.generateHMACSignature(this.secretKey, url, body, timestamp)
      headers = {
        'X-Zabo-Sig': signature,
        'X-Zabo-Timestamp': timestamp
      }
    } else if (!isPublic) {
      headers = { Authorization: 'Bearer ' + utils.getZaboSession() }
    }
    method = method.toLowerCase()

    return { method, url, data, headers }
  }

  _watchConnector (teamSession) {
    this.isWaitingForConnector = true
    this._setListeners(teamSession)

    // Connector timeout (10 minutes)
    const connectorTimeout = setTimeout(() => {
      this.isWaitingForConnector = false

      if (this._onError) {
        this._onError({ error_type: 400, message: 'Connection timeout' })
      }
    }, 10 * 60 * 1000)

    // Watch interval
    const watchInterval = setInterval(() => {
      if (this.isWaitingForConnector) {
        if (this.connector.closed) {
          this.isWaitingForConnector = false

          if (this._onError) {
            this._onError({ error_type: 400, message: 'Connection closed' })
          }
        }
      } else {
        this._removeListeners()

        if (!this.connector.closed) {
          this.connector.close()
        }

        clearInterval(watchInterval)
        clearTimeout(connectorTimeout)
      }
    }, 1000)
  }

  _setListeners (teamSession) {
    // Listen to postMessage
    window.addEventListener('message', this._onMessage, false)

    // Listen to WebSocket
    if (window.WebSocket && teamSession) {
      const wsUrl = new URL(this.baseUrl)
      wsUrl.protocol = 'wss:'
      wsUrl.username = this.clientId
      wsUrl.password = teamSession.one_time_password

      this.ws = new window.WebSocket(wsUrl.toString() + '/accounts')
      this.ws.onmessage = this._onMessage
    }
  }

  _removeListeners () {
    window.removeEventListener('message', this._onMessage, false)

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  _onMessage ({ origin, data }) {
    try {
      data = JSON.parse(data)
    } catch (err) {}

    if (data.zabo) {
      if (origin !== this.connectUrl && !(/\.zabo\.com$/).test(new URL(origin).hostname)) {
        throw new SDKError(401, '[Zabo] Unauthorized attempt to call SDK from origin: ' + origin)
      }

      this.isWaitingForConnector = false

      switch (data.eventName) {
        case 'connectSuccess': {
          if (data.account && data.account.token) {
            this._setAccountSession({
              key: 'zabosession',
              value: data.account.token,
              exp_time: data.account.exp_time
            })
          }

          if (this.resources.accounts && this.resources.transactions) {
            this.resources.accounts._setAccount(data.account)
            this.resources.transactions._setAccount(data.account)
          }

          if (this._onConnection) {
            this._onConnection(data.account)
          }

          break
        }

        case 'connectError': {
          if (this._onError) {
            this._onError(data.error)
          } else {
            throw new SDKError(data.error.error_type, data.error.message)
          }

          break
        }
      }
    }
  }

  _setAccountSession (cookie) {
    const sExpires = '; expires=' + cookie.exp_time
    document.cookie = encodeURIComponent(cookie.key) + '=' + encodeURIComponent(cookie.value) + sExpires
    return true
  }
}

// Export API class
module.exports = API

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

const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS'
const CONNECTION_FAILURE = 'CONNECTION_FAILURE'

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

    this._onConnectorMessage = this._onMessage.bind(this, 'connector')
    this._onSocketMessage = this._onMessage.bind(this, 'socket')

    this._isConnecting = false
    this._isWaitingForConnector = false
  }

  async connect ({ provider } = {}) {
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
      this._isConnecting = true

      try {
        await window.fetch(`${this.connectUrl}/health-check`)

        let url = `${this.connectUrl}/connect`
        url += (provider && typeof provider === 'string') ? `/${provider}` : ''
        url += `?client_id=${this.clientId}`
        url += `&origin=${encodeURIComponent(window.location.host)}`
        url += `&zabo_env=${this.env}`
        url += `&zabo_version=${process.env.PACKAGE_VERSION}`

        const teamSession = await this.resources.teams.getSession()
        if (teamSession) {
          url += `&otp=${teamSession.one_time_password}`
        }

        this.iframe = this._appendIframe('zabo-connect-widget')
        this.connector = window.open(url, this.iframe.name)
        this.connector.focus()

        this._isWaitingForConnector = true
        this._watchConnector(teamSession)
      } catch (err) {
        this._triggerCallback(CONNECTION_FAILURE, { error_type: 500, message: 'Connection refused' })
      }
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
        return utils.createPaginator(response.data, this)
      }
      return response.data
    } catch (err) {
      if (err.response) {
        throw new SDKError(err.response.status, err.response.data.message, err.response.data.request_id)
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
    this._setListeners(teamSession)

    // Connector timeout (10 minutes)
    const connectorTimeout = setTimeout(() => {
      this._closeConnector()
      this._triggerCallback(CONNECTION_FAILURE, { error_type: 400, message: 'Connection timeout' })
    }, 10 * 60 * 1000)

    // Watch interval
    const watchInterval = setInterval(() => {
      if (this._isWaitingForConnector) {
        if (this.connector.closed) {
          this._closeConnector() // Ensure that the connector has been destroyed
          this._triggerCallback(CONNECTION_FAILURE, { error_type: 400, message: 'Connection closed' })
        }
      } else {
        this._removeListeners()
        clearInterval(watchInterval)
        clearTimeout(connectorTimeout)

        this._closeConnector()
      }
    }, 1000)
  }

  _setListeners (teamSession) {
    // Listen to postMessage
    window.addEventListener('message', this._onConnectorMessage, false)

    // Listen to WebSocket
    if (window.WebSocket && teamSession) {
      let wsUrl = new URL(this.baseUrl)
      wsUrl.protocol = 'wss:'
      wsUrl = wsUrl.toString() + '/ws'
      wsUrl += `?client_id=${this.clientId}`
      wsUrl += `&otp=${teamSession.one_time_password}`

      try {
        this.ws = new window.WebSocket(wsUrl)
        this.ws.onmessage = this._onSocketMessage
      } catch (err) {
        console.warn('[Zabo] Error establishing WebSocket connection.', err.message)
      }
    }
  }

  _removeListeners () {
    window.removeEventListener('message', this._onConnectorMessage, false)

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  _onMessage (emitter, { origin, data }) {
    try {
      data = JSON.parse(data)
    } catch (err) {}

    if (data.zabo) {
      if (origin !== this.connectUrl && !(/\.zabo\.com$/).test(new URL(origin).hostname)) {
        throw new SDKError(401, '[Zabo] Unauthorized attempt to call SDK from origin: ' + origin)
      }

      switch (data.eventName) {
        case 'connectSuccess': {
          if (emitter === 'connector') {
            this._isWaitingForConnector = false
          }

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
            this.resources.trading._setAccount(data.account)
          }

          this._triggerCallback(CONNECTION_SUCCESS, data.account)
          break
        }

        case 'connectError': {
          if (emitter === 'connector') {
            this._isWaitingForConnector = false
          }

          this._triggerCallback(CONNECTION_FAILURE, data.error)
          break
        }

        case 'connectClose': {
          this._closeConnector()
          break
        }

        default: {
          if (this._onEvent) {
            this._onEvent(data.eventName, data.metadata || {})
          }
        }
      }
    }
  }

  _setAccountSession (cookie) {
    utils.setCookie(cookie.key, cookie.value, cookie.exp_time)
    return true
  }

  _appendIframe (name) {
    let iframe = document.getElementsByName(name)[0]

    if (!iframe) {
      iframe = document.createElement('iframe')
      iframe.setAttribute('style', 'position:fixed; top:0; left:0; right:0; bottom:0; z-index:2147483647;')
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.frameBorder = 0
      iframe.allow = 'usb *'
      iframe.name = name

      document.body.appendChild(iframe)
    }

    iframe.style.display = 'block'
    return iframe
  }

  _closeConnector () {
    this._isWaitingForConnector = false

    if (!this.connector.closed) {
      this.connector.close()
    }

    if (this.iframe) {
      this.iframe.style.display = 'none'
      this.iframe.src = ''
    }
  }

  _triggerCallback (type, data) {
    if (this._isConnecting) {
      this._isConnecting = false

      if (type === CONNECTION_SUCCESS && this._onConnection) {
        this._onConnection(data)
      }

      if (type === CONNECTION_FAILURE && this._onError) {
        this._onError(data)
      }
    }
  }
}

// Export API class
module.exports = API

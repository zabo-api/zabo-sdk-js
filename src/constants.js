/**
 * @Copyright (c) 2019-present, Zabo, All rights reserved.
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
const { isBrowser } = require('./utils')
const DEFAULT_API_HOST = 'https://api.zabo.com'
const DEFAULT_CONNECT_PATH = 'https://connect.zabo.com'

// This should be updated to {PACKAGE_VERSION} in the future, in order to call
// the right Zabo API instance running for this specific version.
const VERSION = 0 // const VERSION = PACKAGE_VERSION
const SANDBOX_BASE_PATH = `/sandbox-v${VERSION}`
const LIVE_BASE_PATH = `/v${VERSION}`

module.exports = (host, connectHost) => {
  let thisHost, thisConnectHost
  if (host && host !== '') {
    thisHost = host
    if (isBrowser()) {
      thisConnectHost = connectHost
    }
  } else {
    thisHost = DEFAULT_API_HOST
    if (isBrowser()) {
      thisConnectHost = DEFAULT_CONNECT_PATH
    }
  }
  return {
    sandbox: {
      API_BASE_URL: thisHost + SANDBOX_BASE_PATH,
      CONNECT_BASE_URL: thisConnectHost
    },
    live: {
      API_BASE_URL: thisHost + LIVE_BASE_PATH,
      CONNECT_BASE_URL: thisConnectHost
    }
  }
}

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

const DEFAULT_API_HOST = 'https://api.zabo.com'
const DEFAULT_CONNECT_PATH = 'https://connect.zabo.com'
const DEFAULT_API_VERSION = 'v1'

function Constants (host, connectHost, apiVersion) {
  host = host || DEFAULT_API_HOST
  connectHost = connectHost || DEFAULT_CONNECT_PATH
  apiVersion = apiVersion || DEFAULT_API_VERSION

  return {
    sandbox: {
      API_BASE_URL: `${host}/sandbox-${apiVersion}`,
      CONNECT_BASE_URL: connectHost
    },
    live: {
      API_BASE_URL: `${host}/${apiVersion}`,
      CONNECT_BASE_URL: connectHost
    }
  }
}
module.exports = Constants

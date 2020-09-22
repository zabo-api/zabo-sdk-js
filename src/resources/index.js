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
const { ethereum } = require('../networks')

module.exports = async (api, isNode) => {
  if (isNode) {
    return {
      users: require('./users')(api),
      teams: require('./teams')(api),
      blockchains: require('./blockchains')(api),
      currencies: require('./currencies')(api),
      transactions: require('./transactions')(api),
      providers: require('./providers')(api)
    }
  }

  if (api.decentralized) {
    api.ethereum = ethereum
  }

  const accounts = await require('./accounts')(api)
  const resources = {
    teams: require('./teams')(api),
    accounts: accounts,
    currencies: require('./currencies')(api),
    transactions: require('./transactions')(api),
    providers: require('./providers')(api)
  }

  return resources
}

const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const pkg = fs.readFileSync('./package.json')
const version = JSON.parse(pkg).version || 0

module.exports = () => {
  return {
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'zabo.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        PACKAGE_VERSION: version
      }),
      new webpack.BannerPlugin({
        banner: `
          @Copyright (c) 2019-present, Zabo & Modular, Inc. All rights reserved.

          Licensed under the Apache License, Version 2.0 (the "License");
          you may not use this file except in compliance with the License.
          You may obtain a copy of the License at

             http://www.apache.org/licenses/LICENSE-2.0

          Unless required by applicable law or agreed to in writing, software
          distributed under the License is distributed on an "AS IS" BASIS,
          WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
          See the License for the specific language governing permissions and
          limitations under the License.
        `
      })
    ]
  }
}

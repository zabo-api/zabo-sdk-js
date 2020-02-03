const path = require('path')
const webpack = require('webpack')

module.exports = () => {
  const plugins = [
    // Create global constants.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PACKAGE_VERSION': JSON.stringify(process.env.PACKAGE_VERSION)
    }),
    // Add banner to the top of each generated chunk.
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

        @Version: ${JSON.stringify(process.env.PACKAGE_VERSION)}
      `
    })
  ]

  // Compile for usage in a browser-like environment.
  // Output: "./dist/zabo.js"
  const browserConfig = {
    mode: 'production',
    target: 'web',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
      library: 'Zabo',
      filename: 'zabo.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'window'
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /(node_modules)/,
          use: 'babel-loader'
        }
      ]
    },
    plugins
  }

  // Compile for usage in a Node.js-like environment (uses Node.js require to load chunks).
  // Output: "./dist/index.js"
  const modulesConfig = {
    mode: 'production',
    target: 'node',
    node: { process: false },
    entry: './src/index.js',
    output: {
      library: 'Zabo',
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      umdNamedDefine: true,
      // TODO: Hack (for Webpack 4+) to enable create UMD build which can be required by Node without throwing error for window being undefined (https://github.com/webpack/webpack/issues/6522)
      globalObject: "(typeof self !== 'undefined' ? self : this)"
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /(node_modules)/,
          use: 'babel-loader'
        }
      ]
    },
    plugins
  }

  return [browserConfig, modulesConfig]
}

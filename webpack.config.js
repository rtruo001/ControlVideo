const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path')

module.exports = (env, argv) => {
  let fileStr = env.v2 ? 'manifestV2.json' : env.v3 ? 'manifestV3.json' : 'manifestV2.json';
  console.log("Making manifest file version: " + fileStr);
  return {
    entry: {
      'background.js': './src/background.js',
      'popup.js': './src/popup.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]',
      clean: true,
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{
          from: `src/${fileStr}`,
          to: "manifest.json"
        }]
      }),
      new HtmlWebpackPlugin({
        filename: 'popup.html',
        template: 'src/popup.html',
        chunks: ['popup.js'],
      }),
    ],
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
          exclude: /node_modules/
        },
      ]
    },
  }
}
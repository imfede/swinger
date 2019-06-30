const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Swinger",
            template: "src/index.html"
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        compress: true,
        hot: true
    }
  }
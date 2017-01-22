const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const _src = path.resolve(__dirname, 'src');
const _dist = path.resolve(__dirname, 'dist');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(_src, 'app.html'),
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  entry: path.resolve(_src, 'app.js'),
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader', 'eslint-loader']},
      {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
      {test: /\.less$/, loaders: ['style-loader', 'css-loader', 'less-loader']},
      {test: /\.png$/, loader: 'url-loader', query: {limit: 100000}},
      {test: /\.jpe?g$/, loaders: ['file-loader']},
      {test: /\.json$/, loaders: ['json-loader']},
      {test: /\.svg$/, loader: 'react-svg', query: {es5: true, svgo: {plugins: [{removeTitle: false}]}}},
    ],
  },
  output: {
    filename: 'app.bundle.js',
    path: _dist,
  },
  plugins: [HtmlWebpackPluginConfig],
};

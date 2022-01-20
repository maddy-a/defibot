const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './client/index.js',
    start: './client/start.js',
    admin: './client/admin.js',
    theta: './client/theta.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8080
  }
};

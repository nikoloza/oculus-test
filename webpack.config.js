var precss = require('precss')
var cssimport = require('postcss-import')
var cssnext = require('postcss-cssnext')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './app/index.js',
  template: './index.html',
  output: {
    filename: 'bundle.js'
  },
  proxy: {
    '/data/*': './data/'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        plugins: ['transform-class-properties']
      }
    }]
  },
  postcss: function (webpack) {
    return [
      precss,
      cssimport({
        addDependencyTo: webpack
      }),
      cssnext()
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css')
  ]
}

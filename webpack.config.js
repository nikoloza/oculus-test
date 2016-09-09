var precss = require('precss')
var cssimport = require('postcss-import')
var cssnext = require('postcss-cssnext')

module.exports = {
  entry: './app/index.js',
  template: './index.html',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader'
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
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
  plugins: []
}

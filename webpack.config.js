var path = require('path');

module.exports = {
    entry: './currency-converter.js',
    output: {
      filename: 'build.js'
    },
    watch: true,
    devtool: "cheap-inline-module-souce-map"
  };
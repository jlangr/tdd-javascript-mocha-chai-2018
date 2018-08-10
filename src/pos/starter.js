// transpile all code following this line from ES6
require('babel-register')({
    presets: [ 'env' ]
})

module.exports = require('./index.js')

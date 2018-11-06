const withTypescript = require('@zeit/next-typescript')

module.exports = withTypescript({
    publicRuntimeConfig: require('./env')
})

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PROJECT_NAME: '""',
  ANAS_PLAN_NEW: 'true',
})

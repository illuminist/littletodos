require('dotenv').config()
const flow = require('lodash/flow')
const withPWA = require('next-pwa')
const withBundleAnalyzer = require('@next/bundle-analyzer')

module.exports = flow(
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  }),
  withPWA,
)({
  /* config options here */
  pwa: {
    dest: 'public',
  },
})

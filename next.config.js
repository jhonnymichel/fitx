const { withBlitz } = require('@blitzjs/next')

const config = withBlitz({
  reactStrictMode: true,
  blitz: {},
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.forEach((rule) => {
      if (rule.test !== undefined && rule.test.source.includes('|svg|')) {
        rule.test = new RegExp(rule.test.source.replace('|svg|', '|'))
      }
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
})

module.exports = config

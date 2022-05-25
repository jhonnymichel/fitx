const { sessionMiddleware, simpleRolesIsAuthorized } = require('blitz')

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
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
}

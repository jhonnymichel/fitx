const { sessionMiddleware, unstable_simpleRolesIsAuthorized } = require('@blitzjs/server')

module.exports = {
  middleware: [
    sessionMiddleware({
      unstable_isAuthorized: unstable_simpleRolesIsAuthorized,
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

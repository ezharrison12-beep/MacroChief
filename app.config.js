module.exports = ({ config }) => ({
  ...config,
  name: 'MacroChief',
  slug: 'macrochief',
  version: '1.0.0',
  ios: {
    ...(config.ios || {}),
    supportsTablet: true,
    bundleIdentifier: 'com.macrochief.app',
    infoPlist: {
      ...((config.ios && config.ios.infoPlist) || {}),
      NSHealthShareUsageDescription: 'MacroChief uses your Apple Health workouts and activity to adjust your daily nutrition targets.',
      NSHealthUpdateUsageDescription: 'MacroChief may use Apple Health to support your nutrition and activity tracking.'
    }
  },
  plugins: [
    ...(config.plugins || []),
    '@kingstinct/react-native-healthkit'
  ]
});

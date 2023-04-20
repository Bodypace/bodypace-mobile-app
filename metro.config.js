const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);
const { resolver: defaultResolver } = config;

config.resolver = {
  ...defaultResolver,
  sourceExts: [
    ...defaultResolver.sourceExts,
    "cjs",
  ],
  assetExts: [
    ...defaultResolver.assetExts,
    'db',
    'md',
    'txt',
  ]
};
 
module.exports = config;
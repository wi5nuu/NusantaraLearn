const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolution for modern ESM modules
config.resolver.sourceExts.push('mjs', 'es.js', 'cjs');

// Enable modern package exports
config.resolver.unstable_enablePackageExports = true;

// Custom resolver to fix tslib destructuring error
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib' || moduleName.includes('tslib/modules/index.js')) {
    return {
      filePath: path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js'),
      type: 'sourceFile',
    };
  }
  return defaultResolveRequest 
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

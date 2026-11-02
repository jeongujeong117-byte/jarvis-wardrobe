module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Unistyles must run before React Compiler (added by babel-preset-expo via app.json experiments).
    plugins: [['react-native-unistyles/plugin', { root: 'src' }]],
  };
};

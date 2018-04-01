const ChromeManifestPlugin = require('chrome-manifest-plugin');

module.exports = {
  entry: {
      'content-script': './src/content-script.js'
  },
  plugins: [ new ChromeManifestPlugin() ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};

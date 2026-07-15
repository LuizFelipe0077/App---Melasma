const path = require('path');

module.exports = {
  mode: 'none',
  entry: './src/app/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: 'App',
    libraryTarget: 'var'
  },
  resolve: {
    fallback: {
      "crypto": false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { ie: '11' } }]
            ]
          }
        }
      }
    ]
  },
  optimization: {
    minimize: false,
    usedExports: false
  }
};

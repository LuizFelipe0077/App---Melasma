const path = require('path');
const GasPlugin = require('gas-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
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
              ['@babel/preset-env', { targets: { ie: '11' } }] // transpiles private fields
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new GasPlugin()
  ],
  optimization: {
    minimize: false
  }
};

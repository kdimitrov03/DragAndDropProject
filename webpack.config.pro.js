const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Correct way to import

module.exports = {
  mode: 'production', // production mode
  entry: './src/app.ts', // entry point for the application
  output: {
    filename: 'bundle.js', // output bundle file name
    path: path.resolve(__dirname, 'dist') // output directory
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // matches .ts and .tsx files
        use: 'ts-loader', // use ts-loader for TypeScript files
        exclude: /node_modules/, // exclude node_modules directory
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // resolve these extensions
  },
  plugins: [
    new CleanWebpackPlugin(), // clean dist folder before each build
  ],
};

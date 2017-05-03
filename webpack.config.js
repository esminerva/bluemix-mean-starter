'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "app.bundle.js",
    path: __dirname + "/public/js"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: [".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.scss?/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('../css/app.bundle.css')
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    "angular": "angular"
  }
};

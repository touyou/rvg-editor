module.exports = {
  entry: './src/lib/multi-resizer/MultisizeImageLoader.js',
  output: {
    path: __dirname + '/public/js',
    filename: 'rvg-loader.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader"
    }]
  }
};
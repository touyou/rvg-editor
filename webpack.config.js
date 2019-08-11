module.exports = {
  entry: './lib/multi_resizer/multisizeImageLoader.js',
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
}

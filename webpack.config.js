module.exports = {
  entry: './src/scripts.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/build',
  },
  module: {
     rules: [
       {
         test: /\.js?$/,
         loader: 'babel-loader'
       }
    ]
  }
};

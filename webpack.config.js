const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  target: "node",
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: "source-map",
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.min.js'
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        loader: 'ts-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/MTKWeb.*', to: './', flatten: true },
      ]
    }),
     new HtmlWebpackPlugin({
         template: './src/index.html'
     })
  ]
}

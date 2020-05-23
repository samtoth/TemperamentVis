const webpack = require("webpack");
const CopyPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    mode: 'development',
    target: 'node',
    entry: {
        index: './src/index.tsx'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx"]
    },
    node: {
      fs: "empty"
    },
    module: {
        rules: [
            {exclude: /node_modules/},
            /*{
                test: /MTKWeb\.js$/,
                loader: "exports-loader",
                options: {
                    publicPath: "dist/",
                    name: '[name].[hash].[ext]'
                }
            },
            {
                test: /MTKWeb\.wasm$/,
                type: "javascript/auto",
                loader: "file-loader",
                options: {
                    publicPath: "dist/",
                    name: '[name].[hash].[ext]'
                }
            },*/
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            },
            /*
            {
                test: /\.wasm$/,
                loader: "file-loader"
            },
            {
                test: /MTKWeb\.js$/,
                exclude: /node_modules/,
                loader: "export-loader"
            }*/
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/MTKWeb.*', to: './', flatten: true },
            ],
            options: {
                concurrency: 100,
            },
        }),
    ],
}
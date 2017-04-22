let webpack = require('webpack'),
    path = require('path'),
    fs = require('fs'),
    nodeExternals = require('webpack-node-externals'),
    uglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    context: __dirname,
    devtool: false,
    target: 'node',
    entry: {
        lib: './src/LambdaKit.ts'
    },
    output: {
        path: path.join(__dirname, "/lib"),
        filename: "[name].min.js",
        libraryTarget: 'commonjs2'
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts"]
    },
    plugins: [
        //new uglifyJsPlugin({ minimize: true, sourcemap: false }),
    ]
};
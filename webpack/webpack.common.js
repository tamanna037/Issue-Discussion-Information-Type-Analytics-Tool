const webpack = require("webpack");
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        background: path.join(__dirname, '../src/background.ts'),
        content_script: path.join(__dirname, '../src/content.ts'),
        // options: path.join(__dirname, '../src/options.ts'),
        popup: path.join(__dirname, '../src/popup.ts'),
    },
    plugins: [
        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CopyPlugin({
            // Use copy plugin to copy *.wasm to output folder.
            patterns: [{ from: 'node_modules/onnxruntime-web/dist/*.wasm', to: '[name][ext]' }]
        })
    ],
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: "initial"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};





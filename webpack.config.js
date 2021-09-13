const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

const OUTPUT_DIRECTORY = path.join(__dirname, "dist", "js")
const SOURCE_DIRECTORY = path.join(__dirname, "src")

const getEntryPoints = () => {

    const entries = {}
    fs.readdirSync(SOURCE_DIRECTORY).forEach((p) => {
        const target = path.join(__dirname, 'src', p);
        if (fs.lstatSync(target).isDirectory()) {
            const indexPath = path.join(target, 'index.tsx');
            if (fs.existsSync(indexPath)) {
                entries[p] = indexPath;
            }
        }
    });

    return entries;
}

module.exports = {
    mode: "production",
    entry: getEntryPoints(),
    output: {
        path: path.resolve(OUTPUT_DIRECTORY),
        filename: '[name].js'
    },
    devtool: "eval",
    module: {
        rules: [
            { test: /\.tsx?$/, exclude: /(node_modules)/, loader: "ts-loader" },
        ],
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".json"]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, "web"),
                    to: path.join(__dirname, "dist")
                }
            ]
        })
    ]
}
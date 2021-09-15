const path = require('path');
const fs = require('fs');
const process = require('process');

const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

const OUTPUT_DIRECTORY = path.join(__dirname, "dist")
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

const config = {
    entry: getEntryPoints(),
    output: {
        path: path.resolve(OUTPUT_DIRECTORY),
        filename: path.join('js', '[name].js')
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test: /\.(png|jpe?g|gif|jp2|webp|svg|mp4|mp3)$/,
                loader: 'file-loader',
                options: {
                    name: path.join('assets', '[name].[ext]'),
                },
                exclude: /(node_modules)/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssPlugin.loader,
                    'css-modules-typescript-loader',
                    {
                        loader: 'css-loader',
                        options: { modules: true }
                    },
                    'sass-loader',
                    'postcss-loader',
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.json', '.css', '.sass']
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'web'),
                    to: OUTPUT_DIRECTORY
                }
            ]
        }),
        new MiniCssPlugin({
            filename: path.join('assets', '[name].css')
        })
    ]
}

if (process.env.MODE === 'dev') {
    const devMode = {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            static: 'dist',
        }
    }

    module.exports = Object.assign(
        {}, devMode, config
    )

} else {
    module.exports = Object.assign(
        {},
        { mode: 'production', devtool: 'eval' },
        config
    )
}
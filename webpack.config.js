const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const process = require('process');

const OUTPUT_DIRECTORY = path.join(__dirname, "dist", "js")
const SOURCE_DIRECTORY = path.join(__dirname, "src")

// prepare the dist directory if not exist:
const initDist = () => {
    try {
        const distPath = path.join(__dirname, 'dist');
        const webPath = path.join(__dirname, 'web');

        if (fs.existsSync(distPath)) {
            fs.rmSync(distPath, { recursive: true, force: true });
        }

        fs.mkdirSync(distPath);
        // copy all the web folder to distPath
        fsExtra.copySync(webPath, distPath);
        fs.mkdirSync(OUTPUT_DIRECTORY);

    } catch (err) {
        console.log(err);
        process.exit(-1);
    }
}

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

// Run initDist
initDist();
console.log("Initialized dist/");

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
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    }
}
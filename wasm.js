const { loader } = require('webpack');
const { getOptions, interpolateName } = require('loader-utils');
const fs = require('fs');
const path = require('path');

const defaults = {
    targetPath: path.join('assets'),
    targetName: '[name].[ext]',
    esModule: true,
}


const panic = (msg, callback) => {
    if (!callback) {
        throw new Error(msg);
    }

    callback(msg);
}

// Taken from: https://github.com/webpack-contrib/file-loader/blob/master/src/utils.js
const normalizePath = (path, stripTrailing) => {
    if (path === '\\' || path === '/') {
        return '/';
    }

    const len = path.length;

    if (len <= 1) {
        return path;
    }

    let prefix = '';

    if (len > 4 && path[3] === '\\') {
        // eslint-disable-next-line prefer-destructuring
        const ch = path[2];

        if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
            // eslint-disable-next-line no-param-reassign
            path = path.slice(2);
            prefix = '//';
        }
    }

    const segs = path.split(/[/\\]+/);

    if (stripTrailing !== false && segs[segs.length - 1] === '') {
        segs.pop();
    }

    return prefix + segs.join('/');
}

const emitTarget = (ctx, source, options, outputPath) => {
    const fileInfo = {}
    if (typeof options.targetName === 'string') {
        let normalizedName = options.targetName;

        const idx = normalizedName.indexOf('?');

        if (idx >= 0) {
            normalizedName = normalizedName.substr(0, idx);
        }

        const isImmutable = /\[([^:\]]+:)?(hash|contenthash)(:[^\]]+)?]/gi.test(
            normalizedName
        );

        if (isImmutable === true) {
            fileInfo.immutable = true;
        }
    }

    // emit the file with fileInfo
    fileInfo.sourceFilename = normalizePath(
        path.relative(ctx.rootContext, ctx.resourcePath)
    );

    ctx.emitFile(outputPath, source, null, fileInfo);
}

module.exports.loader = (source) => {
    const options = getOptions(this) || defaults;

    // validate the wasm file:
    if (!WebAssembly.validate(source)) {
        panic('Found invalid Web Assembly (.wasm) file', this.emitError);
    }

    // transform the output name:
    const outputName = interpolateName(
        this, options.targetName,
        {
            context: this.rootContext,
            content: source
        }
    );

    const outputPath = path.posix.join(options.targetPath, outputName);

    // emit the file to target destination.
    if (this.emitFile) {
        emitTarget(this, source, options, outputPath)
    }

    // export the JavaScript module:
    // TODO: Wrap in a container, now just emit the string for testing
    return (
        !options.esModule ? 'module.exports = ' + outputPath :
                'export default ' + outputPath
    )
}

// retian the wasm binary file as-is, don't stringify
module.exports.raw = true;
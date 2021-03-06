const { loader } = require('webpack');
const { getOptions, interpolateName } = require('loader-utils');
const path = require('path');

const defaults = {
    targetPath: 'assets',
    targetName: '[contenthash].wasm',
    compileOnly: false,
    esModule: true,
}

const WASM_COMPILE_WRAP = "async () => {" +
    "try {" +
    "return await WebAssembly.compileStreaming(" +
    "    fetch({???}) " +
    ");" +
    "} catch (err) { throw err; }";
"}";

const WASM_INSTANCE_WRAP = "async () => {" +
    "try {" +
    "const res = await WebAssembly.instantiateStreaming(" +
    "    fetch({???}) " +
    ");" +
    "return res.instance.exports;" +
    "} catch (err) { throw err; }" +
    "}";

const panic = (msg, callback) => {
    if (!callback) {
        throw new Error(msg);
    } else {
        callback(new Error(msg));
    }
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

const parseOptions = (options) => {
    const parsedOptions = {}
    Object.keys(defaults).forEach((key) => {
        if (typeof options[key] === 'undefined') {
            parsedOptions[key] = defaults[key];
        } else {
            parsedOptions[key] = options[key];
        }
    });

    return parsedOptions;
}

/*
    wraps in a function that returns a module after streaming compilation
*/
const wrapModuleCompile = (binaryPath) => {

    const urlBinaryPath = JSON.stringify(
        binaryPath.startsWith('/') ? binaryPath : '/' + binaryPath
    );

    return WASM_COMPILE_WRAP.replace("{???}", urlBinaryPath);
}

/*
    wraps in a function that returns a module after streaming compilation and instantiation.
*/
const wrapModuleInstance = (binaryPath) => {

    const urlBinaryPath = JSON.stringify(
        binaryPath.startsWith('/') ? binaryPath : '/' + binaryPath
    );

    return WASM_INSTANCE_WRAP.replace("{???}", urlBinaryPath);
}

module.exports = function loader(source) {
    const options = parseOptions(getOptions(this) || {});

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

    const wrappedLoader = (options.compileOnly) ?
        wrapModuleCompile(outputPath) :
        wrapModuleInstance(outputPath)

    return (
        !options.esModule ? 'module.exports = ' + wrappedLoader :
            'export default ' + wrappedLoader
    )
}

// retian the wasm binary file as-is, don't stringify
module.exports.raw = true;
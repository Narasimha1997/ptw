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

module.exports = (source) => {
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

}
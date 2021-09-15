# ptw
A minimal boilerplate for building frontends using Preact, TypeScript and Web Assembly.

The main focus of PTW is to provide a boilerplate code that focuses on providing    type-safety (TypeScript), light-weight rendering (Preact) and simple to use Web Assembly integration and bundling (using a custom-built webpack loader) while providing ability to develop a modular multi-page web application.

### Features:
* Fully functional TypeScript and PReact support.
* Load and bundle CSS, SASS, JSON, JPEG, PNG, GIF, SVG, MP3, MP4 assets.
* Development Server with hot reloading upon changes.
* Asynchronous streaming Web Assembly Compilation and Instantiation.
* Automatic TypeScript types generation for CSS classes.

### Getting started:
1. Clone the repository:
```
git clone git@github.com:Narasimha1997/ptw.git
```
2. Install dependencies:
```
cd ptw && npm i
```
3. Modify `package.json` and `src/`:
In this repository, we have provided a simple example frontend application, which can be modified as your needs.

4. Build or Run:
To run the dev server:
```
npm run start   #from the project root
```
This will start the live webpack development server.

To generate the minified build:
```
npm run build
```

This will create the build at `dist/` folder.

## Custom Web Assembly plugin:
For loading Web Assembly, we have built a custom webpack loader (See `wasm.js`), the loader copies all the `.wasm` files to `dist/assets` and generates a wrapper code that loads web-assembly using streaming technique, in traditional web assembly compilation, the entire `wasm` binary is loaded into a memory buffer and then compiled, which results in memory overhead, so this method is not practically feseable for loading large web assembly binaries on devices with low memory. The traditional approach of lading wasm files in web frontend is to bundle it as a buffer in a minified JavaScript file, this results in the large file, if this file is not chunked then on low bandwidth networks, the file download may take long time and this might block the main thread from rendering the UI. The `fetch` approach used in this loader will generate a `fetch` call while wrapping which will get executed asynchronously by the browser while it can still load, render and hydrate the UI at the same time.

### Configuring the loader:
The loader provides following options:
```js
const defaults = {
    targetPath: 'assets',
    targetName: '[contenthash].wasm',
    compileOnly: false,
    esModule: true,
}
```
1. `targetPath`: The target path to install the wasm file at. The final path will be: `dist/<targetPath>`, default path is `dist/assets` since the default value of `targetPath` is `assets`.
2. `targetName`: This is the filename of target wasm file, the final path will be `dist/<targetPath>/<targetName>`. You can use any webpack generated formatting strings in this place.
3. `compileOnly`: If true, it will tell the loader to wrap the wasm file with code that just streaming compiles the wasm file. Returns a wasm module which can be instantiated with your own parameters and methods. If it is false, the generated wrapper code produces an instance with default parameters.
4. `esModule`: If true, the module will be exported as per `ES6` standards (i.e `export default {module}`). If false, it uses traditional export. (i.e `module.exports = {module}`).

#### Using these options:
We can just modify the loader options in `webpack.config.js` file. Here is an example:

```js
    rules: {
        .....
        {
            test: /\.wasm$/,
            use: [
                    {
                        loader: path.resolve('./wasm.js'),
                        options: {
                            targetPath: 'assets',
                            targetName: '[name].[ext]'
                        }
                    }
                ]
        }
        ....
    }
```

### Multiple Web pages:
The boilerplate is designed to handle multiple web pages within the same site. The `src` is organized like this (just an example):

```
src/
    - index/
        - index.tsx
        - some_file.tsx
        - some_file_2.tsx
        - some_file.img
        - some_other_file.css
        - some_wasm_file.wasm
        - ....
    - about/
        - index.tsx
        - some_file.tsx
        .....
    - utils/        // this is a non-web module
        - config.json
        - some_util_file.ts
        - some_other_util_file.ts
        ....
```
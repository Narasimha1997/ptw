# ptw
A minimal boilerplate for building frontends using Preact, TypeScript and Web Assembly.

PTW focuses on providing type-safety (TypeScript), light-weight rendering (Preact) and simple to use Web Assembly integration and bundling (using a custom webpack loader, check `./wasm.js`) while providing ability to develop a modular multi-page web application.

### Features:
* Fully functional TypeScript and PReact support.
* Asynchronous-Streaming Web Assembly Loading, Compilation and Instantiation.
* Load and bundle CSS, SASS, JSON, JPEG, PNG, GIF, SVG, MP3, MP4 assets.
* Development Server with hot reloading upon changes.
* Automatic types generation for CSS classes.

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
For loading Web Assembly, we have built a custom webpack loader (See `wasm.js`), the loader copies all the `.wasm` files to `dist/assets` and generates a wrapper code that loads web-assembly using streaming technique, in traditional web assembly compilation, the entire `wasm` binary is loaded into a memory buffer and then compiled, which results in memory overhead, so this method is not practically feseable for loading large web assembly binaries on devices with low memory. The traditional approach of loading wasm files in web frontend is to bundle it as a buffer in a minified JavaScript file, this results in the large file, if this file is not chunked then on low bandwidth networks the file download may take long time and this might block the main thread from rendering the UI. The `fetch` approach used in this loader will generate a `fetch` call while wrapping which will get executed asynchronously by the browser while it can still load, render and hydrate the UI at the same time.

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

### Importing and using WASM files:
The wasm files can be imported as follows:

1. When `compileOnly: false` (i.e instance is produced directly)
```js
import factLoader from './factorial.wasm';

....

// in the place you want to use:

const factInstance = await factLoader();
// assume that there is a function exported called `_Z4facti(int)`, then:
const result = factInstance._Z4facti(10);
console.log(result);

```

2. When `compileOnly: true` (i.e a compiled module is produced)
```js
import factLoader from './factorial.wasm';

....

// in the place you want to use:
const factModule = await factLoader();
const factInstance = await WebAssembly.instantiate(factModule);

// now you can access the exported functions:
const result = factInstance.exports._Z4facti(10);
console.log(result);

```

You can also use `then()-catch()` style:
```js
....

factLoader().then((modOrInst) => {
    ....
}).catch((err) => {
    ....
});

```

### Multiple Web pages:
The boilerplate is designed to handle multiple web pages within the same site. The `src` is organized like this (just an example):

```
src/
    - index/
        - index.tsx
        - some_file.tsx
        - some_file_2.tsx
        - banner.jpg
        - style_1.css
        - style_2.css
        - fib.wasm
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
In the example above, `index/` and `about/` are web-modules. i.e they have an `index.tsx` file. They are compiled and bundled as a separate JavaScript file. The `utils/` is a non-web module, it can be commonly used by any other module, they dont produce any bundle seperately. We can organize the `web/` folder accordingly:

```
web/
    - index.html
    - about.html
```

After build, the generated folder layout in dist will be:
```
dist/
    - js/
        - index.js
        - about.js
    - assets/
        - banner.jpg
        - index.css
        - fib.wasm
    - index.html
    - about.html
```

You can look at `web/` for html examples. Here is sample `web/index.html` page:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Hello World</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel="stylesheet" href="assets/index.css">
</head>

<body>
    <div id="root">
    </div>
    <script src='js/index.js'></script>
</body>

</html>
```
We have to make sure the script src is pointing to `js/index.js` and stylesheet to `assets/index.css`.

#### CSS loading
The boilerplate can generate load and bundle css files as well. The css file is generated one per web module. In the above example, `style_1.css` and `style_2.css` are bundled together in `index.css` file.


### Contributing
If you wish to contribute, feel free to raise any issues, make pull requests or suggest changes.
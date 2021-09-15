import { Component, h, render } from "preact";
import sayHello from '../utils/hello';
import data from './data.json';
import helloWorld from './test.jpg';
import sts from './image.css'
import factModule from './factorial.wasm';


class App extends Component {

    render() {
        factModule().then((res) => {
            const exports = res.instance.exports;
            console.log(exports._Z4facti(10));
        }).catch((err) => {
            console.log(err);
        })

        const helloString = sayHello(data.name);
        return <div className={sts.myImage}> 
            <h3>{helloString}</h3>
            <img src={helloWorld}></img>
            <div className={sts.mP}>
                <p>I am awesome!!!</p>
            </div>
            <a href="/about.html">Go to about!</a>
        </div>
    }
}

render(<App />, document.getElementById("root"));

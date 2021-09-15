import { Component, h, render } from "preact";
import sayHello from '../utils/hello';
import data from './data.json';
import helloWorld from './test.jpg';
import sts from './image.css'

class App extends Component {
    render() {
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

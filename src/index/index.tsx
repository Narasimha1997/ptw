import { Component, h, render } from "preact";
import sayHello from '../utils/hello';
import data from './data.json';
import helloWorld from './test.jpg';
import sts from './image.css'

class App extends Component {
    render() {
        const helloString = sayHello(data.name);
        console.log(sts)
        return <div className={sts.myImage}> 
            <h3>{helloString}</h3>
            <img src={helloWorld}></img>
        </div>
    }
}

render(<App />, document.getElementById("root"));

import { Component, h, render } from "preact";
import sayHello from '../utils/hello';
import data from './data.json';

class App extends Component {
    render() {
        const helloString = sayHello(data.name);
        return <h2>{helloString}</h2>
    }
}

render(<App />, document.getElementById("root"));

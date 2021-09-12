import { Component, h, render } from "preact";
import sayHello from '../utils/hello';

class App extends Component {
    render() {
        const helloString = sayHello("Narasimha");
        return <h2>{helloString}</h2>
    }
}

render(<App />, document.getElementById("root"));

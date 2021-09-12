import { Component, h, render } from "preact";

class App extends Component {
    render() {
        return <h2>Hello World</h2>
    }
}

render(<App />, document.getElementById("root"));

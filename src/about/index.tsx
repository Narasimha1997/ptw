import { Component, h, render} from "preact";

class About extends Component {
    render() {
        return <div>
            <p>Hello, World!!!</p>
            <p>This is about page!</p>
        </div>
    }
}

render(<About />, document.getElementById('root'));
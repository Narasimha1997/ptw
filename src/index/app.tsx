import { h, Component } from 'preact';
import factLoader from './factorial.wasm';
import sts from './styles.css';

interface AppProps {

};


interface AppState {
    wasmLoaded: boolean,
    input: number,
    result: number,
    factInstance: any,
};

class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            wasmLoaded: false,
            input: 1,
            result: 0,
            factInstance: null
        };

        this.updateNumber = this.updateNumber.bind(this);
        this.computeFact = this.computeFact.bind(this);
    }

    componentDidMount() {
        factLoader().then((instance) => {
            this.setState({ factInstance: instance, wasmLoaded: true })
        }).catch((err) => {
            alert("Failed to load wasm module");
            console.log(err);
        });
    }

    updateNumber(e) {
        this.setState({ input: e.target.value });
    }

    computeFact() {
        if (this.state.wasmLoaded) {
            const result = this.state.factInstance._Z4facti(
                this.state.input
            );
            this.setState({ result })
        }
    }

    render(props: AppProps, state: AppState) {
        return (
            <div className={sts.outerContainer}>
                <div className={sts.mainContainer}>
                    <h4>Welcome! This is a dummy application built with ptw</h4>
                    <p>
                        This app computes factorial of given number using web assembly
                        module.
                    </p>
                    <p>Enter the number (Input will be added once wasm module is loaded): </p>
                    <p><a href="/about.html">About</a></p>
                    {
                        (this.state.wasmLoaded) && (
                            <div>
                                <input type="number" value={this.state.input} onChange={this.updateNumber} />
                                <button onClick={this.computeFact}> Compute </button>
                                <h4>{this.state.result}</h4>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default App;
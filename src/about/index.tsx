import { h, Component, render } from 'preact';
import sts from './styles.css';

class About extends Component {
    render() {
        return (
            <div className={sts.outerContainer}>
                <div className={sts.mainContainer}>
                    <p>This is a sample app built using ptw boilerplate.</p>
                    <p>The repository is published <a href="https://github.com/Narasimha1997/ptw" target="_blank">here</a></p>
                </div>
            </div>
        );
    }
}

render(
    <About />,
    document.getElementById('root')
);
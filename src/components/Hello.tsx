import * as React from 'react';
import './Hello.scss';

export interface HelloProps {
    onStart: any
}

type HelloState = {
    started: boolean
}

export class Hello extends React.Component<HelloProps, HelloState>{
    constructor(props) {
        super(props);
        this.state = {started: false};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState({started: true});
        this.props.onStart();
    }

    render() {
        if(!this.state.started) {
            return (
                <div className="splash">
                    <h1>Visualizing regular temperaments</h1>
                    <p>Blah blah blah... blah blah blah blah</p>
                    <button className={'primary start-btn'} onClick={this.handleClick}>
                        start
                    </button>
                </div>
            );
        }
        return <div/>
    }
}
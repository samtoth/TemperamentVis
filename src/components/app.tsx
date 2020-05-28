import * as React from 'react';
import { Hello } from "./Hello"
import {TuningCanvas} from "./TuningCanvas"
import {SettingsPanel} from "./SettingsPanel"

type AppState = {
    period: number,
    generator: number
}

class App extends React.Component<{}, AppState> {
    private audioContext: AudioContext;
    private osc: OscillatorNode;
    private osc2: OscillatorNode;
    private gainNode: GainNode;
    private gainNode2: GainNode;
    private switch: boolean;
    constructor(props) {
        super(props);
        this.state = {period: 2, generator: 1.5};
        this.switch = false;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    }

    onKeyPressed = (e) => {
        if(e.keyCode===32) {
            this.switch = !this.switch;
        }
        if(e.key==='Alt'){
            this.osc2.frequency.setValueAtTime(0,this.audioContext.currentTime);
        }
        if(e.key === 'Control'){
            this.osc.frequency.setValueAtTime(0,this.audioContext.currentTime);
        }
    }

    started = () => {
        console.log("started");
        this.audioContext = new AudioContext();
        this.osc = this.audioContext.createOscillator();
        this.osc.type = "triangle";
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0.2;
        this.osc.connect(this.gainNode.connect(this.audioContext.destination));
        this.osc.frequency.value = 0;
        this.osc.start(0);


        window.addEventListener("keydown", this.onKeyPressed.bind(this));

        this.gainNode2 = this.audioContext.createGain();
        this.gainNode2.gain.value = 0.2;
        this.osc2 = this.audioContext.createOscillator();
        this.osc2.type = "triangle";
        this.osc2.connect(this.gainNode2.connect(this.audioContext.destination));
        this.osc2.frequency.value = 0;
        this.osc2.start(0);
        this.audioContext.resume();
    }

    stateChanged = (p:number ,g:number) => {
        this.setState({period: p, generator: g});
    }

    playNote = (freq: number) => {
        if(this.switch) {
            this.osc.frequency.value = freq * 220;
        }else{
            this.osc2.frequency.value = freq*220;
        }
    }

    stopNote = () => {
        //this.osc.frequency.value = 0;
    }

  render() {
    return (<div>
            <TuningCanvas period={this.state.period} generator={this.state.generator} playNote={this.playNote} stopNote={this.stopNote}/>
            <SettingsPanel period={2} generator={1.5} stateChange={this.stateChanged}/>
            <Hello onStart={this.started}/>
    </div>
    );
  }
}

export default App;

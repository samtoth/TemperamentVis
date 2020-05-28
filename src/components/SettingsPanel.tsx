import * as React from 'react';
import './SettingsPanel.scss';
import { evaluate } from 'mathjs';
import {TextField, Slider } from "@material-ui/core";


interface paramProps{
    name : string,
    defaultVal: number,
    stateChange: (number) => void
}
type paramState = {
    exprResult: number,
    multiplier: number
}

class ParamInput extends React.Component<paramProps, paramState>{
    constructor(props) {
        super(props);
        this.state = {exprResult: this.props.defaultVal, multiplier: 1};
    }

    exprChanged = (event : any) => {
        try {
            const temp = evaluate(event.target.value);
            if(!isNaN(temp)) {
                this.setState({exprResult: temp});
                console.log(temp);
                this.props.stateChange(this.value());
            }
        }finally {

        }
    }

    sliderChange = (event: any, value: number) => {
        this.setState({multiplier: (1 + ((value-50)/1000))});
        this.props.stateChange(this.value());
    }

    value = () => {
         return this.state.exprResult * this.state.multiplier;
    }


    render() {
        return (
            <div className={'paramDiv'}>
                <TextField id="outlined-expression" label={this.props.name} type="default" variant="outlined" defaultValue={this.props.defaultVal} onChange={this.exprChanged}/>
                <Slider
                defaultValue={50}
                scale={(x) => this.state.exprResult*(1 + ((x-50)/1000))}
                valueLabelDisplay="off"
                marks={[{value: 50, label: this.value()}]}
                onChange={this.sliderChange}
                />
            </div>
        );
    }
}

export interface SettingsProps {
    period: number,
    generator: number,
    stateChange: (period: number, generator: number) => void
}

type SettingsState = {
    period: number,
    generator: number
}

export class SettingsPanel extends React.Component<SettingsProps, SettingsState>{
    constructor(props) {
        super(props);
        this.state = {period: props.period, generator: props.generator};
    }

    periodChange = (value: number) => {
        this.setState({period: value});
        this.props.stateChange(this.state.period, this.state.generator);
    }

    generatorChange = (value: number) => {
        this.setState({generator: value});
        this.props.stateChange(this.state.period, this.state.generator);
    }

    render() {
        return (
            <div className={'panel'}>
                <div className={'main'}>
                    <ul>
                        <li><h1>Settings</h1></li>
                        <li><hr/></li>
                        <li><ParamInput name={"Period"} defaultVal={this.props.period} stateChange={this.periodChange}/></li>
                        <li><ParamInput name={"Generator"} defaultVal={this.props.generator} stateChange={this.generatorChange}/></li>
                    </ul>
                </div>
            </div>
        );
    }
}
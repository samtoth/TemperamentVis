import * as React from 'react';
import './TuningCanvas.scss';
import {Stage, Layer, Circle, Text, Group, Line} from 'react-konva'
import {createRef} from "react";
import Konva from 'konva';


export interface TuningProps {
    period: number,
    generator: number,
    playNote: (freq: number) => void,
    stopNote: () => void
}

type TuningState = {
    stageWidth: number,
    stageHeight: number,
    currentHover: string
}

type FreqLine = {
    freq: number,
    colour: string
}

export class TuningCanvas extends React.Component<TuningProps, TuningState> {
    private container: any;
    private lines: FreqLine[];


    constructor(props) {
        super(props);
        this.state = {stageWidth: 0, stageHeight: 0, currentHover: ''};
        // @ts-ignore
        this.container = createRef();
    }

    componentDidMount() {
        this.checkSize();
        // here we should add listener for "container" resize
        // take a look here https://developers.google.com/web/updates/2016/10/resizeobserver
        // for simplicity I will just listen window resize
        window.addEventListener("resize", this.checkSize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkSize);
    }

    private freqToDegree = (freq: number) => {
        return (-2 * Math.PI) * ((Math.log(freq) / Math.log(this.props.period)) % 1) + (Math.PI / 2)
    }

    freqTox = (freq: number) => {
        return (this.state.stageWidth / 2) + 40 * (freq * Math.cos(this.freqToDegree(freq)));
    }

    freqToY = (freq: number) => {
        return (this.state.stageHeight / 2) - 40 * (freq * Math.sin(this.freqToDegree(freq)));
    }

    nodeHover = (ref: string) => {
        this.setState({currentHover: ref});
        // @ts-ignore
        this.refs[ref].to({
            scaleX: 1.3,
            scaleY: 1.3,
            easing: Konva.Easings.EaseInOut,
            duration: 0.1
        });
    }

    nodeHoverOff = (ref: string) => {
        // @ts-ignore
        this.refs[ref].to({
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.EaseInOut,
            duration: 0.1
        });
        this.setState({currentHover: ''})
    }

    nodeClickOn = (freq: number) => {
        this.props.playNote(freq);
    }

    nodeClickOff = () => {
        this.props.stopNote();
    }

    node = (p: number, g: number, freq: number) => {
        var inner;
        const px = this.freqTox(freq);
        const py = this.freqToY(freq)
        const nRef = 'node.' + p + '.' + g;
        if(p==0) {
            this.lines.unshift({freq: freq, colour: (this.state.currentHover == nRef) ? '#0a91ae' : '#383c44'});
        }

        if (this.state.currentHover === nRef) {
            inner = <Text text={freq.toString()} fill={'#0a91ae'} align={'center'} offsetY={30}/>;
        }
        const col = p == 0 ? 'white' : '#444444';
        return (
            <Group>
                <Group x={px} y={py} ref={nRef} onMouseEnter={() => {
                    this.nodeHover(nRef)
                }} onMouseLeave={() => {
                    this.nodeHoverOff(nRef)
                }}
                onMouseDown={() => {this.nodeClickOn(freq)}}
                onMouseUp={() => {this.nodeClickOff()}}>
                    <Circle radius={4} fill={col}/>
                    {inner}
                </Group>
            </Group>
        );
    }

    checkSize = () => {
        const width = this.container.current.offsetWidth;
        const height = this.container.current.offsetHeight;
        this.setState({
            stageWidth: width,
            stageHeight: height,
        });
    };

    generateNodes = (ps: number, gs: number) => {
        let nodes = [];
        for (let j = 0; j < gs; j++) {
            for (let i = -Math.ceil((Math.log(Math.pow(this.props.generator,j))/Math.log(this.props.period))); i < ps; i++) {
                nodes.push(this.node(i, j, Math.pow(this.props.generator, j) * Math.pow(this.props.period, i)));
            }
        }
        return nodes;
    }

    generateFreqCurve = (gs: number) => {
        const res = 32;
        let points = []
        for (let i = 0; i <= (gs - 1) * res; i++) {
            points.push(this.freqTox(Math.pow(this.props.generator, i / res)));
            points.push(this.freqToY(Math.pow(this.props.generator, i / res)));
        }
        return <Line points={points} bezier={false} stroke={'#383c44'}/>
    }

    generateLines = () => {
        let temp = [];
        for(let item of this.lines){
            temp.push(<Line points={[this.state.stageWidth/2, this.state.stageHeight/2, this.freqTox(item.freq), this.freqToY(item.freq)]} stroke={item.colour}/>);
        }
        return temp;
    }

    render() {
        this.lines = [{
            freq: 1.25*Math.pow(this.props.period, 4),
            colour: 'green'
        },
        {
            freq: 1.5*Math.pow(this.props.period, 4),
            colour: 'yellow'
        },
            {
                freq: (7/4)*Math.pow(this.props.period, 4),
                colour: 'orange'
            }];
        var nodeComponents = this.generateNodes(2, 16);
        return (
            <div className={'canvas'} ref={this.container}>
                <Stage width={this.state.stageWidth} height={this.state.stageHeight}>
                    <Layer>
                        {this.generateLines()}
                        <Circle radius={2} x={(this.state.stageWidth / 2)} y={(this.state.stageHeight / 2)}
                                fill={'#181c24'}/>
                        {this.generateFreqCurve(12)}
                        {nodeComponents}
                    </Layer>
                </Stage>
            </div>
        );
    }
}
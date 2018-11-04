import * as React from 'react';
import { Typography } from '@material-ui/core';
import { Slider } from '@material-ui/lab';

interface ActionSliderProps {
    min: number,
    max: number,
    step: any,
    value: number,
    title: string,
    changeValue: (value: any) => void,
}

interface ActionSliderState {
    value: number
}

export default class ActionSlider extends React.Component<ActionSliderProps, ActionSliderState> {
    static defaultProps = {
        min: 0,
        max: 10,
        step: 1,
        value: 5,
        title: 'some number :'
    };

    constructor(props: ActionSliderProps) {
        super(props);
        this.state = { value: this.props.value };
    }

    componentDidUpdate(prevProps: ActionSliderProps, prevState: ActionSliderState) {
        if (this.props.value !== prevProps.value) {
            this.handleChangeOnlyValue(this.props.value);
        }
    }

    public render() {
        const { value } = this.state;

        return (
            <div style={{ margin: '8px' }}>
                <Typography>
                    {this.props.title} {this.state.value.toFixed(2)}
                </Typography>
                <Slider
                    style={{ padding: '16px 0px' }}
                    value={value}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    onChange={this.handleChange}
                ></Slider>
            </div>
        )
    }

    handleChange = (event: any, value: any) => {
        this.props.changeValue(value);
        this.setState({ value });
    };

    handleChangeOnlyValue = (value: any) => {
        this.setState({ value });
    };
}
import * as React from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, IconButton } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import CreateIcon from '@material-ui/icons/Create';

interface ActionSliderProps {
    min: number,
    max: number,
    step: any,
    value: number,
    title: string,
    changeValue: (value: any) => void,
}

interface ActionSliderState {
    value: number,
    textValue: number,
    open: boolean
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
        this.state = { value: this.props.value, textValue: this.props.value, open: false };
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
                <div style={{ display: 'block' }}>
                    <Typography style={{ float: 'left', marginRight: '6px' }}>
                        {this.props.title} {this.state.value.toFixed(2)}
                    </Typography>
                    <IconButton style={{ float: 'left', padding: '0' }} onClick={this.handleOpen}>
                        <CreateIcon fontSize="small"></CreateIcon>
                    </IconButton>
                </div>
                <Slider
                    style={{ padding: '16px 0px', clear: 'both' }}
                    value={value}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    onChange={this.handleChange}
                ></Slider>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Change Value</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            fullWidth
                            onChange={this.handleChangeText}
                            value={this.state.textValue}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleCloseText} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    handleChange = (event: any, value: any) => {
        this.props.changeValue(value);
        this.setState({ value: value });
    };

    handleChangeOnlyValue = (value: any) => {
        this.setState({ value: value });
    };

    handleOpen = () => {
        this.setState({ textValue: this.state.value, open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleChangeText = (event: any) => {
        this.setState({ textValue: Number(event.target.value) });
    }

    handleCloseText = () => {
        if (this.state.textValue < this.props.min || this.state.textValue > this.props.max) {
            return;
        }

        this.setState({ value: this.state.textValue, open: false });
    }
}
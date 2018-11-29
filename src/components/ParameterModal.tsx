import * as React from 'react';
import { Paper, FormControlLabel, Switch, Button, Typography, Divider } from '@material-ui/core';
import ActionSlider from './ActionSlider';
import { KeyFrame, KeyFrameStore } from 'src/stores/ImageCanvasStore';
import { observer, inject } from 'mobx-react';
import { HomeStore } from 'src/stores/HomeStore';

interface IParameterProps {
    xKey: KeyFrame | null;
    yKey: KeyFrame | null;
    keyFrames?: KeyFrameStore;
    home?: HomeStore;
}

@inject('home', 'keyFrames')
@observer
export default class ParameterModal extends React.Component<IParameterProps, any> {
    state = {
        isRatioLocked: false,
    };

    public render() {
        const { xKey, yKey } = this.props

        return (
            <Paper style={{
                padding: '8px'
            }}>
                <div style={{
                    margin: 'auto',
                    width: '128px',
                    height: '8px',
                    backgroundColor: '#eeefff',
                    cursor: 'move'
                }} className="handle"></div>
                {xKey && <div style={{
                    margin: '16px',
                    color: '#424242'
                }}>
                    <Typography variant="subtitle1">X KeyFrame: {xKey.value}</Typography>
                    <ActionSlider min={1} max={xKey.originalLength * 2} step={1} value={xKey.seamLength} title="seam width :" changeValue={this.onChangeSeamWidth} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={xKey.scale} title="horizontal scale :" changeValue={this.onChangeScaleX} />
                    <Button color="secondary" variant="contained" onClick={this.onClickRemoveX}>Remove this key</Button>
                    <Divider light />
                </div>}
                {yKey && <div style={{
                    margin: '16px',
                    color: '#424242'
                }}>
                    <Typography variant="subtitle1">Y KeyFrame: {yKey.value}</Typography>
                    <ActionSlider min={1} max={yKey.originalLength * 2} step={1} value={10} title="seam height :" changeValue={this.onChangeSeamHeight} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={yKey.scale} title="vertical scale :" changeValue={this.onChangeScaleY} />
                    <Button color="secondary" variant="contained" onClick={this.onClickRemoveY}>Remove this key</Button>
                    <Divider light />
                </div>}
                {xKey && yKey && <div style={{ margin: '16px' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.isRatioLocked}
                                onChange={this.toggleRatioLocked}
                                value="locked"
                                color="primary"
                            />
                        }
                        label="Aspect Locked"
                    />
                </div>}
            </Paper>
        )
    }

    public toggleRatioLocked = () => {
        const { isRatioLocked } = this.state;
        this.setState({ isRatioLocked: !isRatioLocked });
    }

    public onClickRemoveX = () => {
        const keyFrames = this.props.keyFrames as KeyFrameStore;
        const home = this.props.home as HomeStore;
        const xKey = this.props.xKey as KeyFrame;
        keyFrames.removeXKey(xKey.id);
        home.setXKey(null);
    }

    public onClickRemoveY = () => {
        const keyFrames = this.props.keyFrames as KeyFrameStore;
        const home = this.props.home as HomeStore;
        const yKey = this.props.yKey as KeyFrame;
        keyFrames.removeXKey(yKey.id);
        home.setYKey(null);
    }

    public onChangeSeamWidth = (value: any) => {
        const newWidth = Number(value);
        const xKey = this.props.xKey as KeyFrame;
        if (newWidth < 1 || xKey.isOriginal) {
            return;
        }
        xKey.setSeamLength(newWidth);
    }

    public onChangeSeamHeight = (value: any) => {
        const newHeight = Number(value);
        const yKey = this.props.yKey as KeyFrame;
        if (newHeight < 1 || yKey.isOriginal) {
            return;
        }
        yKey.setSeamLength(newHeight);
    }

    public onChangeScaleX = (value: any) => {
        const { isRatioLocked } = this.state;
        const { xKey, yKey } = this.props;
        const newValue = Number(value);
        if (xKey!.isOriginal) {
            return;
        }
        let yScale = yKey!.scale;
        if (isRatioLocked) {
            const diff = xKey!.scale - newValue;
            yScale -= diff;
            yKey!.setScale(yScale);
        }
        xKey!.setScale(newValue);
    }

    public onChangeScaleY = (value: any) => {
        const { isRatioLocked } = this.state;
        const { xKey, yKey } = this.props;
        const newValue = Number(value);
        if (yKey!.isOriginal) {
            return;
        }
        let xScale = xKey!.scale;
        if (isRatioLocked) {
            const diff = yKey!.scale - newValue;
            xScale -= diff;
            xKey!.setScale(xScale);
        }
        yKey!.setScale(newValue);
    }
}
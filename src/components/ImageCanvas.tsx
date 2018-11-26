import * as React from 'react';
import ActionSlider from './ActionSlider';
import * as linear from '../lib/math/Matrix';
import { Paper, FormControlLabel, Switch, TextField } from '@material-ui/core';
import { observer } from 'mobx-react';
import { KeyFrame } from 'src/stores/ImageCanvasStore';
import Vec2 from 'src/lib/math/Vec2';
import { PreviewStore } from 'src/stores/PreviewStore';
import { seamCarver } from './SplitContainer';
import { autorun } from 'mobx';

interface IImageProps {
    xKey: KeyFrame;
    yKey: KeyFrame;
    preview: PreviewStore;
    originX: number;
    originY: number;
}

@observer
export default class CanvasContainer extends React.Component<IImageProps, any> {
    state = {
        isRatioLocked: false,
        isDragging: false,
        startPoint: new Vec2(0, 0),
        diffPoint: new Vec2(0, 0)
    };

    canvas: HTMLCanvasElement;
    imageCanvas: HTMLCanvasElement;
    newImage: ImageData;
    ctx: CanvasRenderingContext2D;
    imageCtx: CanvasRenderingContext2D;
    imageMatrix: linear.ColorMatrix;

    get scale(): Vec2 {
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        return new Vec2(xKey.scale, yKey.scale);
    }

    get originPoint(): Vec2 {
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        return new Vec2(xKey.originPosition, yKey.originPosition);
    }

    componentDidMount() {
        this.canvas = this.refs.canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.imageCanvas = document.createElement('canvas');
        this.imageCtx = this.imageCanvas.getContext('2d')!;

        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        this.newImage = seamCarver!.resize(xKey.seamLength, yKey.seamLength);
        this.imageCanvas.width = this.newImage.width;
        this.imageCanvas.height = this.newImage.height;
        this.imageCtx.putImageData(this.newImage, 0, 0);
        this.drawImage(
            xKey.value, yKey.value,
            this.originPoint,
            this.scale
        );
    }

    public render() {
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;

        return (
            <Paper style={{
                position: 'absolute',
                top: this.props.originY,
                left: this.props.originX,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <canvas
                    style={{
                        margin: 'auto'
                    }}
                    ref="canvas"
                    width={xKey.value}
                    height={yKey.value}
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                />

                <div style={{ margin: '4px' }}>
                    <TextField label="width" value={xKey.value} onChange={this.onChangeCanvasWidth} margin="dense" />
                    <TextField label="height" value={yKey.value} onChange={this.onChangeCanvasHeight} margin="dense" />
                </div>
                <div style={{ color: '#424242' }}>
                    <ActionSlider min={1} max={xKey.originalLength * 2} step={1} value={xKey.seamLength} title="seam width :" changeValue={this.onChangeSeamWidth} />
                    <ActionSlider min={1} max={yKey.originalLength * 2} step={1} value={yKey.seamLength} title="seam height :" changeValue={this.onChangeSeamHeight} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={xKey.scale} title="width scale :" changeValue={this.onChangeScaleX} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={yKey.scale} title="height scale :" changeValue={this.onChangeScaleY} />
                </div>
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
            </Paper >
        )
    }

    componentWillReact() {
        const { isDragging } = this.state;
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        if (!isDragging) {
            this.drawImage(
                xKey.value, yKey.value,
                this.originPoint,
                this.scale
            );
        } else {
            // this.drawImage(
            //     xKey.value, yKey.value,
            //     diffPoint,
            //     this.scale
            // );
        }
    }

    updateStore = autorun(() => {
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        this.drawImage(
            xKey.value, yKey.value,
            this.originPoint,
            this.scale
        );
    });

    // componentDidUpdate(prevProps: any, prevState: any) {
    //     const xKey = this.props.xKey;
    //     const yKey = this.props.yKey;
    //     console.log({
    //         x: xKey.value,
    //         y: yKey.value,
    //         point: this.originPoint
    //     })
    //     this.drawImage(
    //         xKey.value, yKey.value,
    //         this.originPoint,
    //         this.scale
    //     );
    // }

    public toggleRatioLocked = () => {
        const { isRatioLocked } = this.state;
        this.setState({ isRatioLocked: !isRatioLocked })
    }

    public onMouseDown = (event: any) => {
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        if (xKey.isOriginal || yKey.isOriginal) {
            return;
        }
        this.setState({
            isDragging: true,
            startPoint: new Vec2(event.clientX, event.clientY)
        });
    }

    public onMouseMove = (event: any) => {
        const { isDragging, startPoint } = this.state;
        if (isDragging) {
            const diffPoint = Vec2.add(Vec2.div(Vec2.sub(new Vec2(event.clientX, event.clientY), startPoint), this.scale), this.originPoint);
            const xKey = this.props.xKey;
            const yKey = this.props.yKey;
            this.drawImage(
                xKey.value, yKey.value,
                diffPoint,
                this.scale
            );
            this.setState({ diffPoint: diffPoint });
        }
    }

    public onMouseUp = (event: any) => {
        const { diffPoint } = this.state;
        const preview = this.props.preview;
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        if (preview.drawImage) {
            preview.drawImage();
        }
        xKey.setOrigin(diffPoint.x);
        yKey.setOrigin(diffPoint.y);
        this.setState({ isDragging: false });
    }

    public onChangeCanvasWidth = (event: any) => {
        // const newWidth = Number(event.target.value);
        // if (isNaN(newWidth)) {
        //     return;
        // }
        // const image = this.props.image;
        // image.onChangeCanvasWidth(newWidth, () => {
        //     this.drawImage(newWidth, image.canvasHeight, image.originPoint, image.scale);
        // });
    }

    public onChangeCanvasHeight = (event: any) => {
        // const newHeight = Number(event.target.value);
        // if (isNaN(newHeight)) {
        //     return;
        // }
        // const image = this.props.image;
        // image.onChangeCanvasHeight(newHeight, () => {
        //     this.drawImage(image.canvasWidth, newHeight, image.originPoint, image.scale);
        // });
    }

    public onChangeSeamWidth = (value: any) => {
        const newWidth = Number(value);
        const xKey = this.props.xKey;
        if (newWidth < 1 || xKey.isOriginal) {
            return;
        }
        xKey.setSeamLength(newWidth);
    }

    public onChangeSeamHeight = (value: any) => {
        const newHeight = Number(value);
        const yKey = this.props.yKey;
        if (newHeight < 1 || yKey.isOriginal) {
            return;
        }
        yKey.setSeamLength(newHeight);
    }

    public onChangeScaleX = (value: any) => {
        const { isRatioLocked } = this.state;
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        const newValue = Number(value);
        if (xKey.isOriginal) {
            return;
        }
        let yScale = yKey.scale;
        if (isRatioLocked) {
            const diff = xKey.scale - newValue;
            yScale -= diff;
            yKey.setScale(yScale);
        }
        xKey.setScale(newValue);
    }

    public onChangeScaleY = (value: any) => {
        const { isRatioLocked } = this.state;
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        const newValue = Number(value);
        if (yKey.isOriginal) {
            return;
        }
        let xScale = xKey.scale;
        if (isRatioLocked) {
            const diff = yKey.scale - newValue;
            xScale -= diff;
            xKey.setScale(xScale);
        }
        yKey.setScale(newValue);
    }

    private drawImage = (width: number, height: number, origin: Vec2, scale: Vec2) => {
        const xKey = this.props.xKey;
        const yKey = this.props.yKey;
        this.newImage = seamCarver!.resize(xKey.seamLength, yKey.seamLength);
        this.imageCanvas.width = this.newImage.width;
        this.imageCanvas.height = this.newImage.height;
        this.imageCtx.putImageData(this.newImage, 0, 0);

        this.ctx.clearRect(0, 0, width, height);
        this.ctx.scale(scale.x, scale.y);
        this.ctx.drawImage(this.imageCanvas, origin.x, origin.y);
        this.ctx.scale(1 / scale.x, 1 / scale.y);

        this.ctx.setLineDash([5, 10]);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'rgba(120,120,255,0.4)';
        this.ctx.strokeRect(0, 0, width, height);

        const preview = this.props.preview;
        if (preview.drawImage) {
            preview.drawImage();
        }
    }
}

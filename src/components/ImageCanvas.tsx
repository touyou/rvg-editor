import * as React from 'react';
// import CanvasView from './CanvasView';
import SeamCarver from '../lib/seams/SeamCarver';
// import SeamCarving from '../utils/warping/SeamCarving';
import ActionSlider from './ActionSlider';
import * as linear from '../lib/warping/Matrix';
import { Paper, Button, FormControlLabel, Switch, TextField } from '@material-ui/core';

interface IContainerProps {
    image: HTMLImageElement;
    width: number;
    height: number;
    isSeam: boolean;
    key: number;
}

class Vec2 {
    constructor(public x: number, public y: number) { }
}

export class ContainerProps {
    constructor(public image: HTMLImageElement, public width: number, public height: number, public isSeam: boolean) { }
}

export default class CanvasContainer extends React.Component<IContainerProps, {}> {

    state = {
        canvasWidth: 0,
        canvasHeight: 0,
        targetWidth: 0,
        targetHeight: 0,
        imageWidth: 0,
        imageHeight: 0,
        start: new Vec2(0, 0),
        diff: new Vec2(0, 0),
        origin: new Vec2(0, 0),
        scale: new Vec2(1, 1),
        locked: false,
        dragging: false,
    };

    handleLockedChange = (event: any, locked: any) => {
        this.setState({ locked: locked })
    }

    handleMouseDown = (event: any) => {
        this.setState({
            dragging: true,
            start: new Vec2(event.clientX, event.clientY),
        })
    }

    handleMouseMove = (event: any) => {
        const {
            dragging, start, scale, origin, canvasWidth, canvasHeight
        } = this.state;
        if (dragging) {
            const diffX = (event.clientX - start.x) / scale.x + origin.x;
            const diffY = (event.clientY - start.y) / scale.y + origin.y;
            const diff = new Vec2(diffX, diffY);
            this.setState({
                diff: diff
            }, () => {
                this.drawImage(canvasWidth, canvasHeight, diff, scale);
            })
        }
    }

    handleMouseUp = () => {
        const { diff } = this.state;
        this.setState({
            dragging: false,
            origin: diff
        })
    }

    changeWidthLabel = (event: any) => {
        const newWidth = Number(event.target.value);
        if (isNaN(newWidth)) {
            return;
        }
        const {
            canvasHeight, scale, origin
        } = this.state;
        this.setState({
            canvasWidth: newWidth
        }, () => {
            this.drawImage(newWidth, canvasHeight, origin, scale);
        })
    }

    changeHeightLabel = (event: any) => {
        const newHeight = Number(event.target.value);
        if (isNaN(newHeight)) {
            return;
        }
        const {
            canvasWidth, scale, origin
        } = this.state;
        this.setState({
            canvasHeight: newHeight
        }, () => {
            this.drawImage(canvasWidth, newHeight, origin, scale);
        })
    }

    changeSeamWidth = (value: any) => {
        const newWidth = Number(value);
        if (newWidth < 217) {
            return;
        }
        const {
            canvasWidth, canvasHeight, targetHeight, scale, origin
        } = this.state;
        this.newImage = this.seamCarver.resize(newWidth, targetHeight);
        this.imageCanvas.width = newWidth;
        this.imageCtx.putImageData(this.newImage, 0, 0);
        this.setState({
            targetWidth: newWidth
        }, () => {
            this.drawImage(canvasWidth, canvasHeight, origin, scale);
        })
    }

    changeScaleX = (value: any) => {
        const { scale, locked, canvasWidth, canvasHeight, origin } = this.state;
        const newScaleX = Number(value);
        const diff = scale.x - newScaleX;
        const newScale = new Vec2(newScaleX, locked ? scale.y - diff : scale.y);
        this.setState({
            scale: newScale
        }, () => {
            this.drawImage(canvasWidth, canvasHeight, origin, newScale)
        })
    }

    changeScaleY = (value: any) => {
        const { scale, locked, canvasWidth, canvasHeight, origin } = this.state;
        const newScaleY = Number(value);
        const diff = scale.y - newScaleY;
        const newScale = new Vec2(locked ? scale.x - diff : scale.x, newScaleY);
        this.setState({
            scale: newScale
        }, () => {
            this.drawImage(canvasWidth, canvasHeight, origin, newScale);
        })
    }

    handleResetButton = () => {
        const { canvasWidth, canvasHeight, imageWidth, imageHeight, targetWidth, targetHeight } = this.state;
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.imageCtx.clearRect(0, 0, targetWidth, targetHeight);
        this.newImage = this.seamCarver.resize(imageWidth, imageHeight);
        this.imageCtx.putImageData(this.newImage, 0, 0);
        this.ctx.drawImage(this.imageCanvas, 0, 0);
        this.setState({
            targetWidth: imageWidth,
            targetHeight: imageHeight,
            start: new Vec2(0, 0),
            diff: new Vec2(0, 0),
            origin: new Vec2(0, 0),
            scale: new Vec2(1, 1),
            locked: false,
            dragging: false,
        })
    }

    drawImage = (width: number, height: number, origin: Vec2, scale: Vec2) => {
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.scale(scale.x, scale.y);
        this.ctx.drawImage(this.imageCanvas, origin.x, origin.y);
        this.ctx.scale(1 / scale.x, 1 / scale.y);

        this.ctx.setLineDash([5, 10]);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'rgba(120,120,255,0.4)';
        this.ctx.strokeRect(0, 0, width, height);
    }

    public seamCarver: SeamCarver;
    canvas: HTMLCanvasElement;
    imageCanvas: HTMLCanvasElement;
    newImage: ImageData;
    ctx: CanvasRenderingContext2D;
    imageCtx: CanvasRenderingContext2D;
    imageMatrix: linear.ColorMatrix;
    // seamCarving: SeamCarving;

    componentDidMount() {
        this.canvas = this.refs.canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.imageCanvas = document.createElement('canvas');
        this.imageCtx = this.imageCanvas.getContext('2d')!;

        const image = this.props.image!
        this.imageCanvas.width = image.naturalWidth;
        this.imageCanvas.height = image.naturalHeight;
        this.imageCtx.drawImage(image, 0, 0, this.imageCanvas.width, this.imageCanvas.height);
        this.seamCarver = new SeamCarver(this.imageCtx.getImageData(0, 0, this.imageCanvas.width, this.imageCanvas.height));
        // this.seamCarving = new SeamCarving(this.imageCtx.getImageData(0, 0, this.imageCanvas.width, this.imageCanvas.height));
        // this.imageMatrix = this.seamCarving.convertImage();
        // this.newImage = this.seamCarving.seamCarving([this.props.width, this.props.height], this.imageMatrix);
        if (this.props.isSeam) {
            this.newImage = this.seamCarver.resize(this.props.width, this.props.height);
        } else {
            this.newImage = this.seamCarver.resize(this.imageCanvas.width, this.imageCanvas.height);
        }
        this.imageCtx.putImageData(this.newImage, 0, 0);
        this.setState({
            imageWidth: image.naturalWidth,
            imageHeight: image.naturalHeight,
            canvasWidth: this.props.width,
            canvasHeight: this.props.height,
            targetWidth: this.props.isSeam ? this.props.width : image.naturalWidth,
            targetHeight: this.props.height
        }, () => {
            this.drawImage(this.props.width, this.props.height, new Vec2(0, 0), new Vec2(1, 1));
        })
    }

    public render() {
        const {
            locked, targetWidth, canvasWidth, canvasHeight, scale
        } = this.state;

        return (
            <Paper style={{
                display: 'flex',
                float: 'left',
                flexDirection: 'column',
                margin: '8px',
            }}>
                <canvas
                    ref="canvas"
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                />

                <div style={{ margin: '4px' }}>
                    <TextField label="width" value={canvasWidth} onChange={this.changeWidthLabel} margin="dense" />
                    <TextField label="height" value={canvasHeight} onChange={this.changeHeightLabel} margin="dense" />
                </div>
                <div style={{ color: '#424242' }}>
                    <ActionSlider min={217} max={1000} step={1} value={targetWidth} title="seam width :" changeValue={this.changeSeamWidth} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={scale.x} title="width scale :" changeValue={this.changeScaleX} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={scale.y} title="height scale :" changeValue={this.changeScaleY} />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={locked}
                                onChange={this.handleLockedChange}
                                value="locked"
                                color="primary"
                            />
                        }
                        label="Aspect Locked"
                    />
                    <Button
                        style={{ margin: '8px' }}
                        variant="contained"
                        color="primary"
                        onClick={this.handleResetButton}>reset</Button>
                </div>
            </Paper >
        )
    }
}

import * as React from 'react';
import SeamCarver from '../lib/seams/SeamCarver';
// import SeamCarving from '../utils/warping/SeamCarving';
import ActionSlider from './ActionSlider';
import * as linear from '../lib/math/Matrix';
import { Paper, Button, FormControlLabel, Switch, TextField } from '@material-ui/core';
import { observer } from 'mobx-react';
import ImageCanvasStore from 'src/stores/ImageCanvasStore';
import Vec2 from 'src/lib/math/Vec2';
// import SeamCarving from 'src/lib/seams/SeamCarving';

interface IImageProps {
    image: ImageCanvasStore;
    seamCarver: SeamCarver;
    originX: number;
}

@observer
export default class CanvasContainer extends React.Component<IImageProps, any> {

    canvas: HTMLCanvasElement;
    imageCanvas: HTMLCanvasElement;
    newImage: ImageData;
    ctx: CanvasRenderingContext2D;
    imageCtx: CanvasRenderingContext2D;
    imageMatrix: linear.ColorMatrix;

    componentDidMount() {
        this.canvas = this.refs.canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.imageCanvas = document.createElement('canvas');
        this.imageCtx = this.imageCanvas.getContext('2d')!;

        const image = this.props.image;

        if (image.isSeamRemove) {
            this.newImage = this.props.seamCarver.resize(image.seamWidth, image.seamHeight);
        } else {
            this.newImage = this.props.seamCarver.resize(image.originalWidth, image.originalHeight);
        }
        this.imageCanvas.width = this.newImage.width;
        this.imageCanvas.height = this.newImage.height;
        console.log(this.newImage);
        this.imageCtx.putImageData(this.newImage, 0, 0);
        this.drawImage(image.canvasWidth, image.canvasHeight, image.originPoint, image.scale);
    }

    public render() {
        const image = this.props.image;

        return (
            <Paper style={{
                position: 'absolute',
                top: 16,
                left: this.props.originX,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <canvas
                    style={{
                        margin: 'auto'
                    }}
                    ref="canvas"
                    width={image.canvasWidth}
                    height={image.canvasHeight}
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                />

                <div style={{ margin: '4px' }}>
                    <TextField label="width" value={image.canvasWidth} onChange={this.onChangeCanvasWidth} margin="dense" />
                    <TextField label="height" value={image.canvasHeight} onChange={this.onChangeCanvasHeight} margin="dense" />
                </div>
                <div style={{ color: '#424242' }}>
                    <ActionSlider min={268} max={1000} step={1} value={image.seamWidth} title="seam width :" changeValue={this.onChangeSeamWidth} />
                    <ActionSlider min={268} max={1000} step={1} value={image.seamHeight} title="seam height :" changeValue={this.onChangeSeamHeight} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={image.scale.x} title="width scale :" changeValue={this.onChangeScaleX} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={image.scale.y} title="height scale :" changeValue={this.onChangeScaleY} />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={image.isRatioLocked}
                                onChange={this.toggleRatioLocked}
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
                        onClick={this.onClickResetButton}>reset</Button>
                </div>
            </Paper >
        )
    }

    public toggleRatioLocked = () => {
        const image = this.props.image;
        image.toggleRatioLocked();
    }

    public onMouseDown = (event: any) => {
        console.log('hello');
        const image = this.props.image;
        image.onMouseDownCanvas(new Vec2(event.clientX, event.clientY));
    }

    public onMouseMove = (event: any) => {
        const image = this.props.image;
        if (image.isDragging) {
            image.onMouseMove(new Vec2(event.clientX, event.clientY), () => {
                this.drawImage(image.canvasWidth, image.canvasHeight, image.diffPoint, image.scale);
            });
        }
    }

    public onMouseUp = (event: any) => {
        const image = this.props.image;
        image.onMouseUp();
    }

    public onChangeCanvasWidth = (event: any) => {
        const newWidth = Number(event.target.value);
        if (isNaN(newWidth)) {
            return;
        }
        const image = this.props.image;
        image.onChangeCanvasWidth(newWidth, () => {
            this.drawImage(newWidth, image.canvasHeight, image.originPoint, image.scale);
        });
    }

    public onChangeCanvasHeight = (event: any) => {
        const newHeight = Number(event.target.value);
        if (isNaN(newHeight)) {
            return;
        }
        const image = this.props.image;
        image.onChangeCanvasHeight(newHeight, () => {
            this.drawImage(image.canvasWidth, newHeight, image.originPoint, image.scale);
        });
    }

    public onChangeSeamWidth = (value: any) => {
        const newWidth = Number(value);
        if (newWidth < 268) {
            return;
        }
        const image = this.props.image;
        this.newImage = this.props.seamCarver.resize(newWidth, image.seamHeight);
        this.imageCanvas.width = newWidth;
        this.imageCtx.putImageData(this.newImage, 0, 0);
        image.onChangeSeamWidth(newWidth, () => {
            this.drawImage(image.canvasWidth, image.canvasHeight, image.originPoint, image.scale);
        });
    }

    public onChangeSeamHeight = (value: any) => {
        const newHeight = Number(value);
        if (newHeight < 268) {
            return;
        }
        const image = this.props.image;
        this.newImage = this.props.seamCarver.resize(image.seamWidth, newHeight);
        this.imageCanvas.height = newHeight;
        this.imageCtx.putImageData(this.newImage, 0, 0);
        image.onChangeSeamHeight(newHeight, () => {
            this.drawImage(image.canvasWidth, image.canvasHeight, image.originPoint, image.scale);
        });
    }

    public onChangeScaleX = (value: any) => {
        const image = this.props.image;
        image.onChangeScaleX(Number(value), (newScale: Vec2) => {
            this.drawImage(image.canvasWidth, image.canvasHeight, image.originPoint, newScale);
        });
    }

    public onChangeScaleY = (value: any) => {
        const image = this.props.image;
        image.onChangeScaleY(Number(value), (newScale: Vec2) => {
            this.drawImage(image.canvasWidth, image.canvasHeight, image.originPoint, newScale);
        });
    }

    public onClickResetButton = () => {
        const image = this.props.image;
        this.ctx.clearRect(0, 0, image.canvasWidth, image.canvasHeight);
        this.imageCtx.clearRect(0, 0, image.seamWidth, image.seamHeight);
        this.newImage = this.props.seamCarver.resize(image.originalWidth, image.originalHeight);
        this.imageCtx.putImageData(this.newImage, 0, 0);
        this.ctx.drawImage(this.imageCanvas, 0, 0);
        image.onClickResetButton();
    }

    private drawImage = (width: number, height: number, origin: Vec2, scale: Vec2) => {
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.scale(scale.x, scale.y);
        this.ctx.drawImage(this.imageCanvas, origin.x, origin.y);
        this.ctx.scale(1 / scale.x, 1 / scale.y);

        this.ctx.setLineDash([5, 10]);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'rgba(120,120,255,0.4)';
        this.ctx.strokeRect(0, 0, width, height);
    }
}

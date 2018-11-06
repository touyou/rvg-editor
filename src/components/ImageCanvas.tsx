import * as React from 'react';
// import CanvasView from './CanvasView';
import SeamCarver from '../lib/seams/SeamCarver';
// import SeamCarving from '../utils/warping/SeamCarving';
import ActionSlider from './ActionSlider';
import * as linear from '../lib/warping/Matrix';
import { Paper, Button, FormControlLabel, Switch, TextField } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ImagesStore } from 'src/stores/ImageCanvasStore';
import Vec2 from 'src/lib/math/Vec2';

interface IContainerProps {
    image: HTMLImageElement;
    width: number;
    height: number;
    isSeam: boolean;
    key: number;
}

export class ContainerProps {
    constructor(public image: HTMLImageElement, public width: number, public height: number, public isSeam: boolean) { }
}

interface IImageProps {
    images?: ImagesStore;
    id: number;
}

@inject('images')
@observer
export default class CanvasContainer extends React.Component<IImageProps> {

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

    public render() {
        const image = this.getImage();

        return (
            <Paper style={{
                display: 'flex',
                float: 'left',
                flexDirection: 'column',
                margin: '8px',
            }}>
                <canvas
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
                    <ActionSlider min={217} max={1000} step={1} value={image.seamWidth} title="seam width :" changeValue={this.onChangeSeamWidth} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={image.scale.x} title="width scale :" changeValue={this.onChangeScaleX} />
                    <ActionSlider min={0.01} max={5} step={0.01} value={image.scale.y} title="height scale :" changeValue={this.onChangeScaleY} />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={image.isRatioLocked}
                                onChange={image.toggleRatioLocked}
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

    private getImage = () => {
        const id = this.props.id;
        const images = this.props.images as ImagesStore;
        const image = images.images[id];
        return image;
    }

    onMouseDown = (event: any) => {
        const image = this.getImage();
        image.onMouseDownCanvas(new Vec2(event.clientX, event.clientY));
    }

    onMouseMove = (event: any) => {
        const image = this.getImage();
        if (image.isDragging) {
            image.onMouseMove(new Vec2(event.clientX, event.clientY), () => {
                this.drawImage(image.canvasWidth, image.canvasHeight, image.diffPoint, image.scale);
            });
        }
    }

    onMouseUp = (event: any) => {
        const image = this.getImage();
        image.onMouseUp();
    }

    onChangeCanvasWidth = (event: any) => {
        const newWidth = Number(event.target.value);
        if (isNaN(newWidth)) {
            return;
        }
        const image = this.getImage();
        image.onChangeCanvasWidth(newWidth, () => {
            this.drawImage(newWidth, image.canvasHeight, image.originPoint, image.scale);
        });
    }

    onChangeCanvasHeight = (event: any) => {
        const newHeight = Number(event.target.value);
        if (isNaN(newHeight)) {
            return;
        }
        const image = this.getImage();
        image.onChangeCanvasHeight(newHeight, () => {
            this.drawImage(image.canvasWidth, newHeight, image.originPoint, image.scale);
        });
    }

    onChangeSeamWidth = (value: any) => {
        const newWidth = Number(value);
        if (newWidth < 217) {
            return;
        }
        const image = this.getImage();
        this.newImage = this.seamCarver.resize(newWidth, image.seamHeight);
        this.imageCanvas.width = newWidth;
        this.imageCtx.putImageData(this.newImage, 0, 0);
        image.onChangeSeamWidth(newWidth, () => {
            this.drawImage(image.canvasWidth, image.canvasHeight, image.originPoint, image.scale);
        });
    }

    onChangeScaleX = (value: any) => {
        const image = this.getImage();
        image.onChangeScaleX(Number(value), (newScale: Vec2) => {
            this.drawImage(image.canvasWidth, image.canvasHeight, image.originPoint, newScale);
        });
    }

    onChangeScaleY = (value: any) => {
        const image = this.getImage();
        image.onChangeScaleY(Number(value), (newScale: Vec2) => {
            this.drawImage(image.canvasWidth, image.canvasHeight, image.originPoint, newScale);
        });
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


}

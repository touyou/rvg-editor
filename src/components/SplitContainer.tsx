import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { AppBar, Toolbar, Typography, IconButton, Button, Modal, Paper, TextField, FormControlLabel, Switch, CircularProgress } from '@material-ui/core';
import CropRotateIcon from '@material-ui/icons/CropRotate';
import ImageIcon from '@material-ui/icons/Image';
import CompareIcon from '@material-ui/icons/Compare';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Home from './Home';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { HomeStore } from 'src/stores/HomeStore';
import ImageCanvasStore, { ImagesStore } from 'src/stores/ImageCanvasStore';
import { MultiResizer } from '../lib/multi-resizer/MultiResizer';
import SeamCarver from 'src/lib/seams/SeamCarver';
import * as UUID from 'uuid/v4';
import Resizable, { NumberSize } from 're-resizable';

interface ISplitProps {
    app?: AppStore;
    home?: HomeStore;
    images?: ImagesStore;
}

export let seamCarver: SeamCarver | null = null;

@inject('app', 'home', 'images')
@observer
export default class SplitContainer extends React.Component<ISplitProps, any> {
    private actions = [
        { icon: <AddIcon />, name: 'Add Image' },
        { icon: <SaveIcon />, name: 'Save Image' },
        { icon: <DeleteIcon />, name: 'Delete All' },
    ]

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    imageCanvas: HTMLCanvasElement;
    imageCtx: CanvasRenderingContext2D;
    resizer: MultiResizer;
    imageName: string;
    private tmpCanvas: HTMLCanvasElement;
    private tmpContext: CanvasRenderingContext2D;
    resizable: Resizable | null;

    colFlag: boolean;
    rowFlag: boolean;
    bothFlag: boolean;
    startValue: number;
    startValueRow: number;

    constructor(props: any, state: any) {
        super(props, state);
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0
        }
        this.colFlag = false;
        this.rowFlag = false;
        this.bothFlag = false;
    }

    componentDidMount() {
        this.canvas = this.refs.canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        this.imageCanvas = document.createElement('canvas');
        this.imageCtx = this.imageCanvas.getContext('2d')!;
        this.tmpCanvas = document.createElement('canvas');
        this.tmpContext = this.tmpCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public render() {
        const app = this.props.app as AppStore;
        const home = this.props.home as HomeStore;

        return (
            <div style={{
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                overflowY: 'scroll'
            }}>
                <AppBar
                    position="relative" color="primary">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Multi-size Image Editor
                        </Typography>
                        <div style={{ flexGrow: 1 }} />
                        <div>
                            <IconButton color="inherit" onClick={app.selectEditorMode}>
                                <CropRotateIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={app.selectPreviewMode}>
                                <ImageIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={app.selectSplitMode}>
                                <CompareIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <div style={{
                    display: 'flex'
                }}>
                    <Home />
                    {/* TODO: Split to component */}
                    <div style={{
                        backgroundColor: '#eee',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        textAlign: 'center',
                        overflowX: 'hidden',
                        height: '100vh',
                        width: this.getPreviewWidth(app.windowMode),
                    }}>
                        <Resizable
                            ref={c => { this.resizable = c; }}
                            style={{
                                margin: 'auto',
                                width: this.state.canvasWidth,
                                height: this.state.canvasHeight,
                            }}
                            handleStyles={{
                                bottom: {
                                    background: 'rgba(128,222,234,0.5)',
                                    height: '5px',
                                    bottom: '-2.5px'
                                },
                                bottomRight: {
                                    background: 'rgba(128,222,234,0.5)',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '5px',
                                    right: '-5px',
                                    bottom: '-5px'
                                },
                                right: {
                                    background: 'rgba(128,222,234,0.5)',
                                    width: '5px',
                                    right: '-2.5px',
                                }
                            }}
                            onResizeStop={this.onResizeStop}
                        >
                            <canvas
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                                ref="canvas"
                                width={this.state.canvasWidth}
                                height={this.state.canvasHeight}
                            />
                        </Resizable>

                        {/* <div style={{ margin: '4px' }}>
                            <TextField label="width" value={this.state.canvasWidth} onChange={this.onChangeCanvasWidth} margin="dense" />
                            <TextField label="height" value={this.state.canvasHeight} onChange={this.onChangeCanvasHeight} margin="dense" />
                        </div> */}
                    </div>
                </div>
                <Modal
                    open={home.isModalOpen}
                    onClose={home.toggleModalOpen}
                >
                    <Paper style={{
                        top: '50%',
                        left: '50%',
                        width: '50%',
                        height: 'auto',
                        overflow: 'hidden',
                        transform: 'translate(50%, 25%)',
                    }}>
                        <div style={{ margin: '2em', paddingTop: '1em' }}>
                            <Typography variant="title">
                                Add New Canvas
                            </Typography>
                        </div>
                        <div style={{ margin: '1em' }}>
                            <TextField label="width" value={home.addWidth} onChange={this.onChangeWidth} margin="normal" />
                            <TextField label="height" value={home.addHeight} onChange={this.onChangeHeight} margin="normal" />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={home.isSeamRemove}
                                        onChange={home.toggleSeamState}
                                        value="seam"
                                        color="primary"
                                    />
                                }
                                label="Initial Seam"
                            />
                            <div style={{ overflow: 'hidden', flexDirection: 'row' }}>
                                <input accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" onChange={this.onClickOpenButton} />
                                <label htmlFor="icon-button-file">
                                    <IconButton color="primary" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                <Typography variant="caption">{home.fileName ? home.fileName! : 'Select a Photo.'}</Typography>
                            </div>
                        </div>
                        <div>
                            <Button
                                style={{ float: 'right', margin: '2em 1em' }}
                                variant="contained"
                                color="primary"
                                onClick={this.onClickAddButton}>Add</Button>
                            {home.isLoading && <CircularProgress size={24} style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: -12,
                                marginLeft: -12
                            }} />}
                        </div>
                    </Paper>
                </Modal>
                <SpeedDial
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                    }}
                    ariaLabel="File"
                    icon={<SpeedDialIcon />}
                    onClick={home.toggleDialOpen}
                    open={home.isDialOpen}
                >
                    {this.actions.map(action => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={() => this.onClickDialAction(action.name)}
                        />
                    ))}
                </SpeedDial>
            </div >
        )
    }

    public getPreviewWidth = (state: WindowMode) => {
        switch (state) {
            case WindowMode.PREVIEW:
                return '100vw';
            case WindowMode.SPLIT:
                return '50vw';
            default:
                return '0vw';
        }
    }

    public drawImage = () => {
        const { canvasWidth, canvasHeight } = this.state;

        if (!seamCarver || canvasWidth <= 0 || canvasHeight <= 0) {
            return;
        }

        const images = this.props.images as ImagesStore;
        this.resizer = images.getResizer(seamCarver!);

        const originX = this.resizer.originX(canvasWidth);
        const originY = this.resizer.originY(canvasHeight);
        const scaleX = this.resizer.scaleX(canvasWidth);
        const scaleY = this.resizer.scaleY(canvasHeight);
        const newImage = this.resizer.seamImageData(canvasWidth, canvasHeight);

        // console.log({ resizer: this.resizer.metainfo, originX: originX, originY: originY, scaleX: scaleX, scaleY: scaleY });

        this.imageCanvas.width = newImage.width;
        this.imageCanvas.height = newImage.height;
        this.imageCtx.putImageData(newImage, 0, 0);

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.scale(scaleX, scaleY);
        this.ctx.drawImage(this.imageCanvas, originX, originY);
        this.ctx.scale(1 / scaleX, 1 / scaleY);
    }

    public onResizeStop = (event: any, direction: any, ref: HTMLDivElement, delta: NumberSize) => {
        const { canvasWidth, canvasHeight } = this.state;
        console.log(delta);
        this.setState({
            canvasWidth: canvasWidth + delta.width,
            canvasHeight: canvasHeight + delta.height
        }, () => {
            this.drawImage();
        })
    }

    public onChangeWidth = (event: any) => {
        const newWidth = Number(event.target.value);
        if (isNaN(newWidth)) {
            return;
        }
        const home = this.props.home as HomeStore;
        home.onChangeWidth(newWidth);
    }

    public onChangeHeight = (event: any) => {
        const newHeight = Number(event.target.value);
        if (isNaN(newHeight)) {
            return;
        }
        const home = this.props.home as HomeStore;
        home.onChangeHeight(newHeight);
    }

    public onChangeCanvasWidth = (event: any) => {
        const newWidth = Number(event.target.value);
        if (isNaN(newWidth)) {
            return;
        }
        this.setState({
            canvasWidth: newWidth
        }, () => {
            this.drawImage();
        })
    }

    public onChangeCanvasHeight = (event: any) => {
        const newHeight = Number(event.target.value);
        if (isNaN(newHeight)) {
            return;
        }
        this.setState({
            canvasHeight: newHeight
        }, () => {
            this.drawImage();
        })
    }

    public onClickOpenButton = (event: any) => {
        const files = event.target.files;
        if (files.length === 0) {
            return;
        }
        this.imageName = files[0].name;
        const home = this.props.home as HomeStore;
        home.onClickOpenButton(URL.createObjectURL(files[0]));
    }

    public onClickDialAction = (type: string) => {
        const home = this.props.home as HomeStore;
        const images = this.props.images as ImagesStore;

        if (type === this.actions[0].name) {        // Add Image
            home.toggleModalOpen();
        } else if (type === this.actions[1].name) { // Save Image
            let name: string = '';
            if (this.imageName) {
                name = this.imageName.replace(/\.(png|svg|jpg|jpeg|gif|bmp|tiff)/, '') + '.msi';
            } else {
                name = 'image,msi';
            }
            images.saveFiles(name, seamCarver!);
        } else if (type === this.actions[2].name) { // Delete Image
            images.deleteAll();
        }
    }

    public onClickAddButton = () => {
        const home = this.props.home as HomeStore;
        const { fileName, originalImage } = home;
        const images = this.props.images as ImagesStore;
        if (!fileName) {
            return;
        }
        if (!originalImage) {
            let image = new Image();
            image.src = fileName;
            home.toggleLoading();
            image.onload = () => {
                this.tmpCanvas.width = image.naturalWidth;
                this.tmpCanvas.height = image.naturalHeight;
                this.tmpContext.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
                this.imageCanvas.width = image.naturalWidth;
                this.imageCanvas.height = image.naturalHeight;
                this.imageCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
                seamCarver = new SeamCarver(this.tmpContext.getImageData(0, 0, image.naturalWidth, image.naturalHeight));
                home.onClickAddButton(image, () => {
                    images.addImage(new ImageCanvasStore(home.isSeamRemove, home, UUID()));
                    this.resizable!.updateSize({ width: image.naturalWidth, height: image.naturalHeight });
                    this.setState({
                        canvasWidth: image.naturalWidth,
                        canvasHeight: image.naturalHeight
                    }, () => {
                        this.drawImage();
                    })
                });
                home.toggleLoading();
            }
        } else {
            home.onClickAddButton(null, () => {
                images.addImage(new ImageCanvasStore(home.isSeamRemove, home, UUID()));
                this.drawImage();
            });
        }
    }

}
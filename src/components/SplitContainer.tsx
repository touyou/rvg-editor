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
import SeamCarver from 'src/lib/seams/SeamCarver';
import * as UUID from 'uuid/v4';
import PreviewContainer from './Preview';
import { PreviewStore } from 'src/stores/PreviewStore';

interface ISplitProps {
    app?: AppStore;
    home?: HomeStore;
    images?: ImagesStore;
    preview?: PreviewStore;
}

export let seamCarver: SeamCarver | null = null;

@inject('app', 'home', 'images', 'preview')
@observer
export default class SplitContainer extends React.Component<ISplitProps, any> {
    private actions = [
        { icon: <AddIcon />, name: 'Add Image' },
        { icon: <SaveIcon />, name: 'Save Image' },
        { icon: <DeleteIcon />, name: 'Delete All' },
    ]

    imageName: string;
    private tmpCanvas: HTMLCanvasElement;
    private tmpContext: CanvasRenderingContext2D;

    colFlag: boolean;
    rowFlag: boolean;
    bothFlag: boolean;
    startValue: number;
    startValueRow: number;

    constructor(props: any, state: any) {
        super(props, state);
        this.colFlag = false;
        this.rowFlag = false;
        this.bothFlag = false;
    }

    componentDidMount() {
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
                    <PreviewContainer />
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
                name = 'image.msi';
            }
            if (seamCarver) {
                images.saveFiles(name, seamCarver);
            }
        } else if (type === this.actions[2].name) { // Delete Image
            images.deleteAll();
            const preview = this.props.preview as PreviewStore;
            if (preview.drawImage) {
                preview.drawImage();
            }
        }
    }

    public onClickAddButton = () => {
        const home = this.props.home as HomeStore;
        const preview = this.props.preview as PreviewStore;
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
                seamCarver = new SeamCarver(this.tmpContext.getImageData(0, 0, image.naturalWidth, image.naturalHeight));
                home.onClickAddButton(image, () => {
                    images.addImage(new ImageCanvasStore(home.isSeamRemove, home, UUID()));
                    preview.setSize(image.naturalWidth, image.naturalHeight);
                });
                home.toggleLoading();
            }
        } else {
            home.onClickAddButton(null, () => {
                images.addImage(new ImageCanvasStore(home.isSeamRemove, home, UUID()));
                if (preview.drawImage) {
                    preview.drawImage();
                }
            });
        }
    }

}
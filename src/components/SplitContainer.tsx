import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { AppBar, Toolbar, Typography, IconButton, Button, Modal, Paper, TextField, FormControlLabel, Switch, CircularProgress, Menu, MenuItem } from '@material-ui/core';
import CropRotateIcon from '@material-ui/icons/CropRotate';
import ImageIcon from '@material-ui/icons/Image';
import CompareIcon from '@material-ui/icons/Compare';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import MoreIcon from '@material-ui/icons/MoreVert';
import Home from './Home';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { HomeStore } from 'src/stores/HomeStore';
import { KeyFrameStore } from 'src/stores/ImageCanvasStore';
import SeamCarver from 'src/lib/seams/SeamCarver';
import PreviewContainer from './Preview';
import { PreviewStore } from 'src/stores/PreviewStore';
import { Rnd } from 'react-rnd';
import ParameterModal from './ParameterModal';

interface ISplitProps {
    app?: AppStore;
    home?: HomeStore;
    keyFrames?: KeyFrameStore;
    preview?: PreviewStore;
}

export let seamCarver: SeamCarver | null = null;

@inject('app', 'home', 'keyFrames', 'preview')
@observer
export default class SplitContainer extends React.Component<ISplitProps, any> {
    private actions = [
        { icon: <AddIcon />, name: 'Add Image' },
        { icon: <SaveIcon />, name: 'Save Image' },
        { icon: <DeleteIcon />, name: 'Delete All' },
    ]

    state = {
        anchorEl: null,
    };

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
                            <IconButton color="inherit" disabled={app.windowMode === WindowMode.EDITOR} onClick={app.selectEditorMode}>
                                <CropRotateIcon />
                            </IconButton>
                            <IconButton color="inherit" disabled={app.windowMode === WindowMode.PREVIEW} onClick={app.selectPreviewMode}>
                                <ImageIcon />
                            </IconButton>
                            <IconButton color="inherit" disabled={app.windowMode === WindowMode.SPLIT} onClick={app.selectSplitMode}>
                                <CompareIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={this.handleMenu}>
                                <MoreIcon />
                            </IconButton>
                            <Menu
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(this.state.anchorEl)}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleFinish}>テストを終了する</MenuItem>
                                <MenuItem onClick={this.handleClose}>説明ページを開く</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <div style={{
                    display: 'flex'
                }}>
                    <Home />
                    <PreviewContainer />
                </div>
                <Rnd
                    default={{
                        x: 16,
                        y: 100,
                        width: 'auto',
                        height: 'auto'
                    }}
                    style={{
                        zIndex: 500,
                    }}
                    enableResizing={{
                        top: false, right: false, bottom: false, left: false,
                        topRight: false, bottomRight: false, bottomLeft: false, topLeft: false
                    }}
                    dragHandleClassName="handle"
                >
                    <ParameterModal
                        xKey={home.selectedXKey}
                        yKey={home.selectedYKey}></ParameterModal>
                </Rnd>
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
                            <Typography variant="h6">
                                Add New Canvas or keyFrame
                            </Typography>
                        </div>
                        <div style={{ margin: '1em' }}>
                            <TextField style={{ display: home.originalImage && home.isXSet ? 'block' : 'none' }} label="width" value={home.addWidth} onChange={this.onChangeWidth} margin="normal" />
                            <TextField style={{ display: home.originalImage && home.isYSet ? 'block' : 'none' }} label="height" value={home.addHeight} onChange={this.onChangeHeight} margin="normal" />
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

    public handleMenu = (event: any) => {
        this.setState({ anchorEl: event.currentTarget });
    }
    public handleClose = () => {
        this.setState({ anchorEl: null });
    }

    public handleFinish = () => {
        const keyFrames = this.props.keyFrames as KeyFrameStore;
        let name: string = '';
        if (this.imageName) {
            name = this.imageName.replace(/\.(png|svg|jpg|jpeg|gif|bmp|tiff)/, '') + '.rvg';
        } else {
            name = 'image.rvg';
        }
        keyFrames.sendFiles(name)
        window.open('https://goo.gl/forms/A6CicN7mNpYCuxSl1', '_blank');
        this.setState({ anchorEl: null });
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
        const keyFrames = this.props.keyFrames as KeyFrameStore;

        if (type === this.actions[0].name) {        // Add Image
            home.toggleModalOpen();
        } else if (type === this.actions[1].name) { // Save Image
            let name: string = '';
            if (this.imageName) {
                name = this.imageName.replace(/\.(png|svg|jpg|jpeg|gif|bmp|tiff)/, '') + '.rvg';
            } else {
                name = 'image.rvg';
            }
            if (seamCarver) {
                keyFrames.saveFiles(name);
            }
        } else if (type === this.actions[2].name) { // Delete Image
            keyFrames.deleteAll();
            seamCarver = null;
            home.removeImage();
            const preview = this.props.preview as PreviewStore;
            if (preview.drawImage) {
                preview.drawImage();
            }
        }
    }

    public onClickAddButton = () => {
        const home = this.props.home as HomeStore;
        const preview = this.props.preview as PreviewStore;
        const keyFrames = this.props.keyFrames as KeyFrameStore;
        const { fileName, originalImage } = home;
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
                keyFrames.setSeamCarver(seamCarver);
                home.onClickAddButton(image, () => {
                    // 読み込み時には3点を予め読み込む
                    keyFrames.addFrame(
                        image.naturalWidth, image.naturalWidth, image.naturalWidth, true
                    );
                    keyFrames.addFrame(
                        Math.floor(image.naturalWidth / 2), image.naturalWidth,
                        home.isSeamRemove ? Math.floor(image.naturalWidth / 2) : image.naturalWidth,
                        true
                    );
                    keyFrames.addFrame(
                        image.naturalWidth * 2, image.naturalWidth,
                        home.isSeamRemove ? image.naturalWidth * 2 : image.naturalWidth,
                        true
                    );
                    keyFrames.addFrame(
                        image.naturalHeight, image.naturalHeight, image.naturalHeight, false
                    );
                    keyFrames.addFrame(
                        Math.floor(image.naturalHeight / 2), image.naturalHeight,
                        home.isSeamRemove ? Math.floor(image.naturalHeight / 2) : image.naturalHeight,
                        false
                    );
                    keyFrames.addFrame(
                        image.naturalHeight * 2, image.naturalHeight,
                        home.isSeamRemove ? image.naturalHeight * 2 : image.naturalHeight,
                        false
                    );
                    preview.setSize(image.naturalWidth, image.naturalHeight);
                    home.setXKey(keyFrames.sortedXKeyFrames[0]);
                    home.setYKey(keyFrames.sortedYKeyFrames[0]);
                });
                home.toggleLoading();
            }
        } else {
            home.onClickAddButton(null, () => {
                if (home.isXSet) {
                    keyFrames.addFrame(
                        home.addWidth, home.originalImage!.naturalWidth,
                        home.isSeamRemove ? home.addWidth : home.originalImage!.naturalWidth,
                        true
                    );
                }
                if (home.isYSet) {
                    keyFrames.addFrame(
                        home.addHeight, home.originalImage!.naturalHeight,
                        home.isSeamRemove ? home.addHeight : home.originalImage!.naturalHeight,
                        false
                    );
                }
                home.toggleXParam(true);
                home.toggleYParam(true);
                if (preview.drawImage) {
                    preview.drawImage();
                }
            });
        }
    }

}
import { Button, Modal, Paper, Typography, TextField, FormControlLabel, Switch, CircularProgress, IconButton } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { HomeStore } from 'src/stores/HomeStore';
import CanvasContainer from './ImageCanvas';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import SeamCarver from 'src/lib/seams/SeamCarver';
import ImageCanvasStore, { ImagesStore } from 'src/stores/ImageCanvasStore';
import * as UUID from 'uuid/v4';

interface IHomeProps {
    home?: HomeStore;
    app?: AppStore;
    images?: ImagesStore;
}

@inject('home', 'app', 'images')
@observer
export default class Home extends React.Component<IHomeProps> {

    seamCarver: SeamCarver;
    private tmpCanvas: HTMLCanvasElement;
    private tmpContext: CanvasRenderingContext2D;

    componentDidMount() {
        this.tmpCanvas = document.createElement('canvas');
        this.tmpContext = this.tmpCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public render() {
        const home = this.props.home as HomeStore;
        const app = this.props.app as AppStore;
        const images = this.props.images as ImagesStore;

        return (
            <div style={{
                textAlign: 'center',
                overflow: 'hidden',
                width: this.getEditorWidth(app.windowMode),
            }}>

                {images.images.map((image: ImageCanvasStore) => (
                    <CanvasContainer
                        key={image.id}
                        image={image}
                        seamCarver={this.seamCarver}
                    />
                ))}

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
            </div>
        );
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
                this.seamCarver = new SeamCarver(this.tmpContext.getImageData(0, 0, image.naturalWidth, image.naturalHeight));
                home.onClickAddButton(image, () => {
                    images.addImage(new ImageCanvasStore(home.isSeamRemove, home, UUID()));
                });
                home.toggleLoading();
            }
        } else {
            home.onClickAddButton(null, () => {
                images.addImage(new ImageCanvasStore(home.isSeamRemove, home, UUID()));
            });
        }
    }

    public onClickOpenButton = (event: any) => {
        const files = event.target.files;
        if (files.length === 0) {
            return;
        }
        const home = this.props.home as HomeStore;
        home.onClickOpenButton(URL.createObjectURL(files[0]));
    }

    public getEditorWidth = (state: WindowMode) => {
        switch (state) {
            case WindowMode.EDITOR:
                return '100vw';
            case WindowMode.SPLIT:
                return '50vw';
            default:
                return '0vw';
        }
    }
}

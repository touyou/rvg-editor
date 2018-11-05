import { Button, Modal, Paper, Typography, TextField, FormControlLabel, Switch, CircularProgress, AppBar, Toolbar, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { HomeState } from 'src/stores/HomeStore';
import CanvasContainer, { ContainerProps } from './ImageCanvas';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';

interface IHomeProps {
    home?: HomeState;
}

@inject('home')
@observer
export default class Home extends React.Component<IHomeProps> {
    private actions = [
        { icon: <AddIcon />, name: 'Add Image' },
        { icon: <SaveIcon />, name: 'Save Image' },
        { icon: <DeleteIcon />, name: 'Delete All' },
    ]

    public render() {
        const { home } = this.props;

        if (!home) {
            throw new Error('no props');
        }

        return (
            <div style={{
                position: 'relative',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '100vh'
            }}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Multi-size Image Editor
                    </Typography>
                    </Toolbar>
                </AppBar>
                {home.imageCanvas.map((container: ContainerProps, index: number) => (
                    <CanvasContainer
                        key={index}
                        image={container.image}
                        width={container.width}
                        height={container.height}
                        isSeam={container.isSeam}
                    />
                ))}
                <SpeedDial
                    style={{
                        bottom: '24px',
                        position: 'fixed',
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
        const { home } = this.props;
        if (!home) {
            throw new Error('no props');
        }
        home.onChangeWidth(newWidth);
    }

    public onChangeHeight = (event: any) => {
        const newHeight = Number(event.target.value);
        if (isNaN(newHeight)) {
            return;
        }
        const { home } = this.props;
        if (!home) {
            throw new Error('no props');
        }
        home.onChangeHeight(newHeight);
    }

    public onClickAddButton = () => {
        const { home } = this.props;
        if (!home) {
            return;
        }
        const { fileName, originalImage } = home;
        if (!fileName) {
            return;
        }
        if (!originalImage) {
            let image = new Image();
            image.src = fileName;
            home.toggleLoading();
            image.onload = () => {
                home.onClickAddButton(image);
                home.toggleLoading();
            }
        } else {
            home.onClickAddButton();
        }
    }

    public onClickOpenButton = (event: any) => {
        const files = event.target.files;
        if (files.length === 0) {
            return;
        }
        const { home } = this.props;
        if (!home) {
            throw new Error('no props');
        }
        home.onClickOpenButton(URL.createObjectURL(files[0]));
    }

    public onClickDialAction = (type: string) => {
        const { home } = this.props;
        if (!home) {
            throw new Error('no props');
        }

        if (type === this.actions[0].name) {        // Add Image
            home.toggleModalOpen();
        } else if (type === this.actions[1].name) { // Save Image
            /** TODO */
        } else if (type === this.actions[2].name) { // Delete Image
            home.onClickDeleteAllButton();
        }
    }
}

import { Button, Modal, Paper, Typography, TextField, FormControlLabel, Switch, CircularProgress, Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { HomeState } from 'src/stores/HomeStore';
import CanvasContainer, { ContainerProps } from './ImageCanvas';

interface IHomeProps {
    home?: HomeState;
}

@inject('home')
@observer
export default class Home extends React.Component<IHomeProps> {
    public render() {
        const { home } = this.props;

        if (!home) {
            throw new Error('no props');
        }

        return (
            <div style={{
                position: 'relative',
                margin: '16px',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '100vh'
            }}>
                {home.imageCanvas.map((container: ContainerProps, index: number) => (
                    <CanvasContainer
                        key={index}
                        image={container.image}
                        width={container.width}
                        height={container.height}
                        isSeam={container.isSeam}
                    />
                ))}
                <Button
                    style={{
                        bottom: '24px',
                        position: 'fixed',
                        right: '24px',
                    }}
                    variant="fab"
                    color="primary"
                    onClick={home.toggleModalOpen}
                >
                    <AddIcon />
                </Button>
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
                                {home.fileName ? <Typography variant="caption">{home.fileName!}</Typography> :
                                    <Input type="file" onChange={this.onClickOpenButton}></Input>}
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
}

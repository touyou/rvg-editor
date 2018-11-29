import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { HomeStore } from 'src/stores/HomeStore';
import CanvasContainer from './ImageCanvas';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import { KeyFrameStore } from 'src/stores/ImageCanvasStore';
import { PreviewStore } from 'src/stores/PreviewStore';
import { Button, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as UUID from 'uuid/v4';

interface IHomeProps {
    home?: HomeStore;
    app?: AppStore;
    preview?: PreviewStore;
    keyFrames?: KeyFrameStore;
}

const EDGE_MARGIN = 64;

@inject('home', 'app', 'keyFrames', 'preview')
@observer
export default class Home extends React.Component<IHomeProps> {

    public render() {
        const app = this.props.app as AppStore;
        const preview = this.props.preview as PreviewStore;
        const keyFrames = this.props.keyFrames as KeyFrameStore;
        const home = this.props.home as HomeStore;

        const xKeyFrames = keyFrames.sortedXKeyFrames;
        const yKeyFrames = keyFrames.sortedYKeyFrames;
        let canvasArray: any[] = [];
        let buttonArray: any[] = [];
        let originY = EDGE_MARGIN;
        let originX = EDGE_MARGIN;
        for (let i = 0; i < yKeyFrames.length; i++) {
            originX = EDGE_MARGIN + 64;
            for (let j = 0; j < xKeyFrames.length; j++) {
                const id = yKeyFrames[i].id + '_' + xKeyFrames[j].id;
                const xKey = xKeyFrames[j];
                const yKey = yKeyFrames[i];
                canvasArray.push(<CanvasContainer
                    key={id}
                    xKey={xKey}
                    yKey={yKey}
                    preview={preview}
                    originX={originX}
                    originY={originY}
                />);
                originX += Math.max(xKeyFrames[j].value, 80) + 16;
            }
            const yKey = yKeyFrames[i];
            if (yKey.value === yKey.originalLength) {
                originY += yKeyFrames[i].value + 48 + 16;
                continue;
            }
            buttonArray.push(<Button
                key={yKey.id}
                variant={
                    home.selectedYKey && yKey.id === home.selectedYKey.id ? 'contained' : 'outlined'
                }
                color="default"
                style={{
                    position: 'absolute',
                    top: originY + (yKeyFrames[i].value + 48) / 2 - 32,
                    left: '16px',
                    display: 'flex'
                }}
                onClick={() => {
                    this.setXKey(yKey.id);
                }}
            >
                {yKey.value}
            </Button>);
            originY += yKeyFrames[i].value + 48 + 16;
        }

        originX = EDGE_MARGIN + 64;
        for (let j = 0; j < xKeyFrames.length; j++) {
            const xKey = xKeyFrames[j];
            if (xKey.value === xKey.originalLength) {
                originX += Math.max(xKeyFrames[j].value, 80) + 16;
                continue;
            }
            buttonArray.push(<Button
                key={xKey.id}
                variant={
                    home.selectedXKey && xKey.id === home.selectedXKey.id ? 'contained' : 'outlined'
                }
                color="default"
                style={{
                    position: 'absolute',
                    top: '16px',
                    left: originX + Math.max(xKeyFrames[j].value, 80) / 2 - 32,
                    display: 'flex'
                }}
                onClick={() => {
                    this.setXKey(xKey.id);
                }}
            >
                {xKey.value}
            </Button>);
            originX += Math.max(xKeyFrames[j].value, 80) + 16;
        }

        if (buttonArray.length !== 0) {
            buttonArray.push(<IconButton
                key={UUID()}
                color="primary"
                style={{
                    position: 'absolute',
                    top: '16px',
                    left: originX,
                    display: 'flex'
                }}
                onClick={() => {
                    home.toggleYParam(false);
                    home.toggleModalOpen();
                }}
            ><AddIcon /></IconButton>);
            buttonArray.push(<IconButton
                key={UUID()}
                color="primary"
                style={{
                    position: 'absolute',
                    top: originY,
                    left: '16px',
                    display: 'flex'
                }}
                onClick={() => {
                    home.toggleXParam(false);
                    home.toggleModalOpen();
                }}
            ><AddIcon /></IconButton>);
        }

        return (
            <div style={{
                backgroundColor: '#fff',
                textAlign: 'center',
                overflow: 'scroll',
                width: this.getEditorWidth(app.windowMode),
                height: '100vh'
            }}>
                <div style={{
                    width: originX + 128,
                    height: originY + 128,
                    position: 'relative'
                }}>
                    {buttonArray}
                    {canvasArray}
                </div>
            </div>
        );
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

    public setXKey = (id: string) => {
        const home = this.props.home as HomeStore;
        const keyFrames = this.props.keyFrames as KeyFrameStore;
        home.setXKey(keyFrames.getXKey(id));
    }

    public setYKey = (id: string) => {
        const home = this.props.home as HomeStore;
        const keyFrames = this.props.keyFrames as KeyFrameStore;
        home.setYKey(keyFrames.getYKey(id));
    }
}

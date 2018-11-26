import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { HomeStore } from 'src/stores/HomeStore';
import CanvasContainer from './ImageCanvas';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import { KeyFrameStore } from 'src/stores/ImageCanvasStore';
import { PreviewStore } from 'src/stores/PreviewStore';

interface IHomeProps {
    home?: HomeStore;
    app?: AppStore;
    preview?: PreviewStore;
    keyFrames?: KeyFrameStore;
}

@inject('home', 'app', 'keyFrames', 'preview')
@observer
export default class Home extends React.Component<IHomeProps> {

    public render() {
        const app = this.props.app as AppStore;
        const preview = this.props.preview as PreviewStore;
        const keyFrames = this.props.keyFrames as KeyFrameStore;

        const xKeyFrames = keyFrames.sortedXKeyFrames;
        const yKeyFrames = keyFrames.sortedYKeyFrames;
        let canvasArray: any[] = [];
        let originY = 16;
        let originX = 16;
        for (let i = 0; i < yKeyFrames.length; i++) {
            originX = 16;
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
                originX += Math.max(xKeyFrames[j].value, 346) + 16;
            }
            originY += yKeyFrames[i].value + 365 + 16;
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
                    width: originX,
                    height: originY,
                    position: 'relative'
                }}>
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
}

import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { HomeStore } from 'src/stores/HomeStore';
import CanvasContainer from './ImageCanvas';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import { ImagesStore } from 'src/stores/ImageCanvasStore';
// import { ImagesStore } from 'src/stores/ImageCanvasStore';
import { seamCarver } from './SplitContainer';
import { PreviewStore } from 'src/stores/PreviewStore';

interface IHomeProps {
    home?: HomeStore;
    app?: AppStore;
    images?: ImagesStore;
    preview?: PreviewStore;
}

@inject('home', 'app', 'images', 'preview')
@observer
export default class Home extends React.Component<IHomeProps> {

    public render() {
        const app = this.props.app as AppStore;
        const images = this.props.images as ImagesStore;
        const preview = this.props.preview as PreviewStore;

        let imageArray = images.images.slice();
        imageArray.sort((a, b) => {
            if (a.canvasWidth === b.canvasWidth) {
                return a.canvasHeight < b.canvasHeight ? 1 : 0;
            }
            return a.canvasWidth < b.canvasWidth ? 1 : 0;
        })
        let canvasArray: any[] = [];
        let originX = 16;
        for (let image of imageArray) {
            const width = Math.max(image.canvasWidth, 346);
            canvasArray.push(<CanvasContainer
                key={image.id}
                image={image}
                preview={preview}
                seamCarver={seamCarver!}
                originX={originX}
            />)
            originX += width + 16;
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
                    height: '100vh',
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

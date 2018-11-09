import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { HomeStore } from 'src/stores/HomeStore';
import CanvasContainer from './ImageCanvas';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import ImageCanvasStore, { ImagesStore } from 'src/stores/ImageCanvasStore';
import { seamCarver } from './SplitContainer';

interface IHomeProps {
    home?: HomeStore;
    app?: AppStore;
    images?: ImagesStore;
}

@inject('home', 'app', 'images')
@observer
export default class Home extends React.Component<IHomeProps> {

    public render() {
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
                        seamCarver={seamCarver!}
                    />
                ))}
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

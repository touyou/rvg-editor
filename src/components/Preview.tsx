import * as React from 'react';
import { AppStore, WindowMode } from 'src/stores/AppStore';
import Resizable, { NumberSize } from 're-resizable';
import { MultiResizer } from 'src/lib/multi-resizer/MultiResizer';
import { seamCarver } from './SplitContainer';
import { PreviewStore } from 'src/stores/PreviewStore';
import { inject, observer } from 'mobx-react';
import { KeyFrameStore } from 'src/stores/ImageCanvasStore';
import { autorun } from 'mobx';

interface IPreviewProps {
  app?: AppStore;
  keyFrames?: KeyFrameStore;
  preview?: PreviewStore;
}

export let resizer: MultiResizer | null = null;

@inject('app', 'keyFrames', 'preview')
@observer
export default class PreviewContainer extends React.Component<IPreviewProps, any> {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imageCanvas: HTMLCanvasElement;
  imageCtx: CanvasRenderingContext2D;
  imageName: string;

  componentDidMount() {
    this.canvas = this.refs.canvas as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.imageCanvas = document.createElement('canvas');
    this.imageCtx = this.imageCanvas.getContext('2d')!;

    const preview = this.props.preview as PreviewStore;
    preview.drawImage = this.drawImage;
  }

  public render() {
    const app = this.props.app as AppStore;
    const preview = this.props.preview as PreviewStore;
    const keyFrames = this.props.keyFrames as KeyFrameStore;
    console.log(keyFrames);

    return (
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
          style={{
            margin: 'auto'
          }}
          size={{
            width: preview.canvasWidth,
            height: preview.canvasHeight
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
            width={preview.canvasWidth}
            height={preview.canvasHeight}
          />
        </Resizable>
      </div>
    )
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    this.drawImage();
  }

  updateStore = autorun(() => {
    if (this.drawImage) {
      this.drawImage();
    }
  });

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
    const preview = this.props.preview as PreviewStore;
    const canvasWidth = preview.canvasWidth;
    const canvasHeight = preview.canvasHeight;

    if (!seamCarver || canvasWidth <= 0 || canvasHeight <= 0) {
      console.log('seamCarver null')
      return;
    }

    const keyFrames = this.props.keyFrames as KeyFrameStore
    resizer = keyFrames.resizer;

    if (!resizer) {
      console.log('resizer null');
      return;
    }
    const originX = resizer.originX(canvasWidth);
    const originY = resizer.originY(canvasHeight);
    const scaleX = resizer.scaleX(canvasWidth);
    const scaleY = resizer.scaleY(canvasHeight);
    const newImage = resizer.seamImageData(canvasWidth, canvasHeight);

    this.imageCanvas.width = newImage.width;
    this.imageCanvas.height = newImage.height;
    this.imageCtx.putImageData(newImage, 0, 0);

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.scale(scaleX, scaleY);
    this.ctx.drawImage(this.imageCanvas, originX, originY);
    this.ctx.scale(1 / scaleX, 1 / scaleY);
  }

  public onResizeStop = (event: any, direction: any, ref: HTMLDivElement, delta: NumberSize) => {
    const preview = this.props.preview as PreviewStore;
    preview.onChangeSize(delta, () => {
      this.drawImage();
    })
  }
}

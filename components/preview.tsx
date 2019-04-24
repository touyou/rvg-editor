/**
 * Preview Screen
 */
import React, { useRef, useEffect, useState } from 'react';
import EditPoint from 'lib/editPoint';
import { NDArray } from '@bluemath/common';
import { MultiResizer } from 'lib/multi_resizer/multiResizer';
import Resizable, { NumberSize } from 're-resizable';
import CircleButton from './atom/circleButton';

type Props = {
  editPoints: EditPoint[];
  width: number;
  height: number;
  image: ImageData;
  resizer?: MultiResizer;
  onChangeMode: () => void;
  isFullScreen: boolean;
}

function Preview(props: Props) {
  const canvasRefContainer = useRef();
  const [canvasWidth, setCanvasWidth] = useState(props.width);
  const [canvasHeight, setCanvasHeight] = useState(props.height);

  useEffect(() => {
    setTimeout(updateImage, 10);
  }, [props.editPoints, props.image, props.resizer]);

  useEffect(() => {
    setCanvasWidth(props.width);
    setCanvasHeight(props.height);
  }, [props.width, props.height]);

  function updateImage() {
    if (props.image != null && props.resizer != null) {
      const originPoint = new NDArray([props.resizer.originX(canvasWidth), props.resizer.originY(canvasHeight)]);
      const scaleX = props.resizer.scaleX(canvasWidth) * getScale();
      const scaleY = props.resizer.scaleY(canvasHeight) * getScale();
      drawImage(canvasWidth, canvasHeight, originPoint, scaleX, scaleY);
    }
  }

  function drawImage(width: number, height: number, origin: NDArray, hScale: number, vScale: number) {
    // Initialize
    const imageCanvas = document.createElement('canvas');
    const imageCtx = imageCanvas.getContext('2d');
    const canvasCtx = (canvasRefContainer.current as HTMLCanvasElement).getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);
    const newImage = props.resizer.seamImageData(width, height);

    // Prepare Image
    imageCanvas.width = newImage.width;
    imageCanvas.height = newImage.height;
    imageCtx.putImageData(newImage, 0, 0);

    // Change Scale and Render to canvas
    canvasCtx.scale(hScale, vScale);
    canvasCtx.drawImage(imageCanvas, origin.data[0], origin.data[1]);
    canvasCtx.scale(1 / hScale, 1 / vScale);
  }

  function getScale() {
    return props.isFullScreen ? 1.0 : 0.2;
  }

  const commonStyle = `
    .canvas {
      position: absolute;
      display: block;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background-color: #fff;
    }
  `;

  const sidePanelStyle = commonStyle + `
      .preview {
        position: relative;
        overflow: scroll;
        flex: 1 1 auto;
        background-color: #eee;
        transition: .2s;
      }`;

  const fullScreenStyle = commonStyle + `
      .preview {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: scroll;
        background-color: #eee;
        z-index: 100;
        transition: .2s;
      }`;

  const style = (<style jsx>{props.isFullScreen ? fullScreenStyle : sidePanelStyle}</style>);

  return (
    <div className='preview'>
      <CircleButton
        border='none'
        backgroundColor='#707070'
        color='#fff'
        onClick={() => {
          props.onChangeMode();
        }}>
        <img
          src={props.isFullScreen ? '../static/scale-minus-icon.svg' : '../static/scale-plus-icon.svg'}
          style={{ width: '1em', verticalAlign: 'middle' }}
        />
      </CircleButton>
      <Resizable
        style={{
          margin: 'auto'
        }}
        size={{
          width: canvasWidth * getScale(),
          height: canvasHeight * getScale(),
        }}
        onResizeStop={(event, direction, ref, delta: NumberSize) => {
          if (!props.isFullScreen) return;

          setCanvasWidth(canvasWidth + delta.width);
          setCanvasHeight(canvasHeight + delta.height);
          updateImage();
        }}
      >
        <canvas
          className='canvas'
          ref={canvasRefContainer}
          width={canvasWidth * getScale()}
          height={canvasHeight * getScale()}
        ></canvas>
      </Resizable>
      {style}
    </div>
  );
}

export default Preview;

/**
 * Preview Screen
 */
import React, { useRef, useEffect, useState } from 'react';
import EditPoint from '../lib/editPoint';
import { NDArray } from '@bluemath/common';
import { MultiResizer, BaseResizer } from '../lib/multi_resizer/multiResizer';
import Resizable, { NumberSize } from 're-resizable';
import CircleButton from './atom/circleButton';
import ListButton from './atom/listButton';
import { templates, Device } from '../lib/templateSize';
import { RbfResizer } from '../lib/multi_resizer/newResizer';

type Props = {
  editPoints: EditPoint[];
  width: number;
  height: number;
  image: ImageData;
  resizer?: BaseResizer;
  resizeMode: number;
  onChangeMode: () => void;
  isFullScreen: boolean;
}

function Preview(props: Props) {
  const canvasRefContainer = useRef();
  const [canvasWidth, setCanvasWidth] = useState(props.width);
  const [canvasHeight, setCanvasHeight] = useState(props.height);
  const [isSizeList, setSizeList] = useState(false);

  useEffect(() => {
    setTimeout(updateImage, 10);
  }, [props.editPoints, props.image, props.resizer]);

  useEffect(() => {
    setCanvasWidth(props.width);
    setCanvasHeight(props.height);
  }, [props.width, props.height]);

  function updateImage() {
    if (props.image != null && props.resizer != null) {
      let resizer: MultiResizer = props.resizer as MultiResizer;
      const originPoint = new NDArray([resizer.originX(canvasWidth), resizer.originY(canvasHeight)]);
      const scaleX = resizer.scaleX(canvasWidth) * getScale();
      const scaleY = resizer.scaleY(canvasHeight) * getScale();
      drawImage(canvasWidth, canvasHeight, originPoint, scaleX, scaleY);
    }
  }

  function drawImage(width: number, height: number, origin: NDArray, hScale: number, vScale: number) {
    let resizer: MultiResizer = props.resizer as MultiResizer;

    // Initialize
    const imageCanvas = document.createElement('canvas');
    const imageCtx = imageCanvas.getContext('2d');
    const canvasCtx = (canvasRefContainer.current as HTMLCanvasElement).getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);
    const newImage = resizer.seamImageData(width, height);

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
      margin: 8px;
      background-color: #fff;
    }`;

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

  const style = props.isFullScreen ? (<style jsx>{fullScreenStyle}</style>) : (<style jsx>{sidePanelStyle}</style>);

  const sizeList = [
    <ListButton key='original-button' onClick={() => {
      setCanvasHeight(props.image.height);
      setCanvasWidth(props.image.width);
      setTimeout(updateImage, 10);
    }} value='Original'></ListButton>
  ];
  Object.entries(templates).forEach((value) => {
    const key: string = value[0];
    const device: Device = value[1];
    sizeList.push(
      <ListButton key={key} onClick={() => {
        setCanvasWidth(device.width);
        setCanvasHeight(device.height);
        setTimeout(updateImage, 10);
      }} value={device.name}></ListButton>
    );
  });

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
      {props.isFullScreen ?
        (<div className='devices'>
          <div
            className='handle'
            onClick={() => {
              setSizeList(!isSizeList);
            }}
          >
          </div>
          {isSizeList ? (<div className='size-wrapper'>{sizeList}</div>) : null}
          <style jsx>{`
          .handle {
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            height: ${isSizeList ? ((Object.entries(templates).length + 1) * 61).toString() + 'px' : '100%'};
            vertical-align: middle;
            cursor: pointer;
            transition: .2s;
            background-color: #888;
          }
          .handle:hover {
            background-color: #ddd;
          }
          .devices {
            position: fixed;
            top: 0;
            right: 0;
            display: block;
            overflow-y: scroll;
            overflow-x: fixed;
            width: ${isSizeList ? '20%' : '20px'};
            height: 100%;
            background-color: #fff;
            z-index: 10;
            transition: .2s;
            box-shadow: 0 0 3px 5px rgba(0,0,0,0.1);
          }
          .size-wrapper {
            padding-left: 20px;
          }
        `}</style>
        </div>) : null}
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

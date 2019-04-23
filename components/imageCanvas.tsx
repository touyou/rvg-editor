/**
 * Image Rendering Canvas
 */

import React, { useRef, useEffect, useState } from 'react';
import EditPoint from 'lib/editPoint';
import { NDArray, add, div, sub } from '@bluemath/common';

type Props = {
  canvasWidth: number,
  canvasHeight: number,
  image: ImageData,
  currentEditPoint: EditPoint,
  viewScale: number,
  onChangeOrigin?: (NDArray) => void;
  isEditable?: boolean,
  isSelected?: boolean,
  onClick?: (number) => void,
  id?: number,
}

function ImageCanvas(props: Props) {
  const canvasRefContainer = useRef();
  const [isDragging, setDragging] = useState(false);
  const [startPoint, setStart] = useState(new NDArray([0.0, 0.0]));
  const [diffPoint, setDiff] = useState(new NDArray([0.0, 0.0]));

  useEffect(() => {
    if (props.image != null) {
      const hScale = props.viewScale * props.currentEditPoint.hScale;
      const vScale = props.viewScale * props.currentEditPoint.vScale;
      const origin = new NDArray([props.currentEditPoint.x, props.currentEditPoint.y]);
      drawImage(props.canvasWidth, props.canvasHeight, origin, hScale, vScale);
    }
  }, [props.canvasHeight, props.canvasWidth, props.viewScale, props.image, props.currentEditPoint]);

  function drawImage(width: number, height: number, origin: NDArray, hScale: number, vScale: number) {
    // Initialize
    const imageCanvas = document.createElement('canvas');
    const imageCtx = imageCanvas.getContext('2d');
    const canvasCtx = (canvasRefContainer.current as HTMLCanvasElement).getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);

    // Prepare Image
    imageCanvas.width = props.image.width;
    imageCanvas.height = props.image.height;
    imageCtx.putImageData(props.image, 0, 0);

    // Change Scale and Render to canvas
    canvasCtx.scale(hScale, vScale);
    canvasCtx.drawImage(imageCanvas, origin.data[0], origin.data[1]);
    canvasCtx.scale(1 / hScale, 1 / vScale);
  }

  function onMouseDown(event: any) {
    if (!props.isEditable) return;
    setDragging(true);
    setStart(new NDArray([event.clientX, event.clientY]));
  }

  function onMouseMove(event: any) {
    if (!props.isEditable) return;
    if (isDragging) {
      const hScale = props.viewScale * props.currentEditPoint.hScale;
      const vScale = props.viewScale * props.currentEditPoint.vScale;
      const diffPoint = new NDArray([(event.clientX - startPoint.data[0]) * hScale + props.currentEditPoint.x, (event.clientY - startPoint.data[1]) * vScale + props.currentEditPoint.y]);
      drawImage(props.canvasWidth, props.canvasHeight, diffPoint, hScale, vScale);
      setDiff(diffPoint);
    }
  }

  function onMouseUp(event: any) {
    if (!props.isEditable) return;
    props.onChangeOrigin(diffPoint);
    setDragging(false);
  }

  return (
    <div className={props.isEditable ? '' : 'list-canvas'}>
      <canvas
        ref={canvasRefContainer}
        className={props.isEditable ? 'canvas' : (props.isSelected ? 'selected' : '')}
        width={props.canvasWidth * props.viewScale}
        height={props.canvasHeight * props.viewScale}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={props.isEditable ? () => { } : () => { props.onClick(props.id) }}
      >
      </canvas>
      <style jsx>{`
        .canvas {
          position: absolute;
          display: block;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          margin: auto;
          background-color: #ffffff;
        }
        .list-canvas {
          display: inline-block;
          background-color: #fff;
          margin: 8px;
        }
        .selected {
          border: 4px #FFD380 solid;
        }
      `}</style>
    </div>
  );
}

export default ImageCanvas;

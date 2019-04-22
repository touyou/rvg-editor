/**
 * Preview Screen
 */
import React, { useRef, useEffect, useState } from 'react';
import EditPoint from 'lib/editPoint';
import { NDArray } from '@bluemath/common';
import { MultiResizer } from 'lib/multi_resizer/multiResizer';

type Props = {
  editPoints: EditPoint[];
  width: number;
  height: number;
  image: ImageData;
  resizer?: MultiResizer;
}

function Preview(props: Props) {
  const canvasRefContainer = useRef();
  const [canvasWidth, setCanvasWidth] = useState(props.width);
  const [canvasHeight, setCanvasHeight] = useState(props.height);

  useEffect(() => {

    if (props.image != null && props.resizer != null) {
      let originPoint = new NDArray([props.resizer.originX(canvasWidth), props.resizer.originY(canvasHeight)]);
      drawImage(canvasWidth, canvasHeight, originPoint, props.resizer.scaleX(canvasWidth) * 0.2, props.resizer.scaleY(canvasHeight) * 0.2);
    }
  }, [props.editPoints, props.image, props.resizer]);

  useEffect(() => {
    setCanvasWidth(1000);
    setCanvasHeight(300);
  }, [props.width, props.height]);

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

  return (
    <div className='preview'>
      <canvas
        className='canvas'
        ref={canvasRefContainer}
        width={canvasWidth * 0.2}
        height={canvasHeight * 0.2}
      ></canvas>
      <style jsx>{`
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
        .preview {
          position: relative;
          overflow: scroll;
          flex: 1 1 auto;
          background-color: #eee;
        }
        `}</style>
    </div>
  )
}

export default Preview;

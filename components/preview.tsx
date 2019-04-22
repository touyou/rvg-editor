/**
 * Preview Screen
 */
import React, { useRef, useEffect, useState } from 'react';
import EditPoint from 'lib/editPoint';

type Props = {
  editPoints: EditPoint[];
  width: number;
  height: number;
  image: ImageData;
}

function Preview(props: Props) {
  const canvasRefContainer = useRef();
  const [canvasWidth, setCanvasWidth] = useState(props.width);
  const [canvasHeight, setCanvasHeight] = useState(props.height);

  useEffect(() => {
    const canvasCtx = (canvasRefContainer.current as HTMLCanvasElement).getContext('2d');

    if (props.image != null) {
      console.log(props.image);
      const imageCanvas = document.createElement('canvas');
      const imageCtx = imageCanvas.getContext('2d');
      const canvasCtx = (canvasRefContainer.current as HTMLCanvasElement).getContext('2d');
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

      imageCanvas.width = props.image.width;
      imageCanvas.height = props.image.height;
      imageCtx.putImageData(props.image, 0, 0);

      canvasCtx.scale(0.2, 0.2);
      canvasCtx.drawImage(imageCanvas, 0, 0);
      canvasCtx.scale(5, 5);
    }
  }, [props.editPoints, props.image]);

  useEffect(() => {
    console.log(props);
    setCanvasWidth(props.width);
    setCanvasHeight(props.height);
  }, [props.width, props.height]);

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

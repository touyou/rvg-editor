/**
 * Navigate Point Panel
 */
import React, { useEffect, useRef } from 'react';
import EditPoint from '../lib/editPoint';

type Props = {
  width: number;
  height: number;
  editPoints: EditPoint[];
  selectedIndex: number;
};

function getCanvasPos(length: number, minP: number, scale: number) {
  return (length - minP) * scale + 40;
}

function drawCoordinate(canvasCtx: CanvasRenderingContext2D, width: number, height: number, xmin: number, ymin: number, scaleX: number, scaleY: number, editPoints: EditPoint[]) {
  // 座標軸
  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.strokeStyle = 'rgb(112, 112, 112)';
  canvasCtx.lineWidth = 2;
  canvasCtx.beginPath();
  canvasCtx.moveTo(8, 16);
  canvasCtx.lineTo(width - 16, 16);
  canvasCtx.moveTo(20, 8);
  canvasCtx.lineTo(20, height - 16);
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.restore();

  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.fillStyle = 'rgb(112, 112, 112)';
  canvasCtx.font = "8px 'Futura', sans-serif";
  canvasCtx.textBaseline = 'bottom';
  for (let editPoint of editPoints) {
    let x = getCanvasPos(editPoint.canvasWidth, xmin, scaleX);
    let y = getCanvasPos(editPoint.canvasHeight, ymin, scaleY);
    canvasCtx.moveTo(x, 16);
    canvasCtx.arc(x, 16, 2, 0, 2 * Math.PI);
    canvasCtx.moveTo(20, y);
    canvasCtx.arc(20, y, 2, 0, 2 * Math.PI);
    canvasCtx.textAlign = 'center';
    canvasCtx.fillText(editPoint.canvasWidth.toString(), x, 14);
    canvasCtx.textAlign = 'right';
    canvasCtx.fillText(editPoint.canvasHeight.toString(), 18, y + 4);
  }
  canvasCtx.fill();
  canvasCtx.closePath();
  canvasCtx.restore();
}

function Navigator(props: Props) {
  const canvasRefContainer = useRef();

  useEffect(() => {
    const canvasCtx = (canvasRefContainer.current as HTMLCanvasElement).getContext('2d');

    let xmin: number;
    let xmax: number;
    let ymin: number;
    let ymax: number;
    for (let editPoint of props.editPoints) {
      if (xmin == null || xmin > editPoint.canvasWidth) xmin = editPoint.canvasWidth;
      if (xmax == null || xmax < editPoint.canvasWidth) xmax = editPoint.canvasWidth;
      if (ymin == null || ymin > editPoint.canvasHeight) ymin = editPoint.canvasHeight;
      if (ymax == null || ymax < editPoint.canvasHeight) ymax = editPoint.canvasHeight;
    }

    let scaleX = (props.width - 80) / (xmax - xmin == 0 ? 2 : xmax - xmin);
    let scaleY = (props.height - 80) / (ymax - ymin == 0 ? 2 : ymax - ymin);

    canvasCtx.clearRect(0, 0, props.width, props.height);
    drawCoordinate(canvasCtx, props.width, props.height, xmin, ymin, scaleX, scaleY, props.editPoints);

    // Point
    for (let i = 0; i < props.editPoints.length; i++) {
      let x = getCanvasPos(props.editPoints[i].canvasWidth, xmin, scaleX);
      let y = getCanvasPos(props.editPoints[i].canvasHeight, ymin, scaleY);
      canvasCtx.save();
      canvasCtx.beginPath();
      if (i == props.selectedIndex) {
        canvasCtx.fillStyle = 'rgb(255, 211, 128)';
      } else {
        canvasCtx.fillStyle = 'rgb(112, 112, 112)';
      }
      canvasCtx.moveTo(x, y);
      canvasCtx.arc(x, y, 4, 0, 2 * Math.PI);
      canvasCtx.fill();
      canvasCtx.closePath();
      canvasCtx.restore();
    }
  }, [props.width, props.height, props.editPoints, props.selectedIndex])

  return (
    <div className='navigator'
      onClick={() => {
        console.log('zoom in');
      }}
    >
      <canvas
        ref={canvasRefContainer}
        width={props.width}
        height={props.height}
      ></canvas>
      <style jsx>{`
        canvas {
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          margin: auto;
        }
        .navigator {
          position: absolute;
          top: 0;
          right: 0;
          margin: 16px;
          border-radius: 5px;
          border: 2px #707070 solid;
          background-color: #fff;
          width: ${props.width}px;
          height: ${props.height}px;
          cursor: zoom-in;
        }
      `}</style>
    </div>
  );
}

export default Navigator;

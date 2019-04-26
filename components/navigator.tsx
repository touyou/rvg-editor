/**
 * Navigate Point Panel
 */
import React, { useEffect, useRef, useState } from 'react';
import EditPoint from '../lib/editPoint';
import ImageCanvas from './atom/imageCanvas';

type Props = {
  image: ImageData;
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
    updateView();
  }, [props.width, props.height, props.editPoints, props.selectedIndex])

  const [isFullScreen, setFullScreen] = useState(false);
  useEffect(updateView);

  function updateView() {
    console.log('update at ' + isFullScreen);
    if (!isFullScreen) {
      drawPoints();
    }
  }

  function drawPoints() {
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
  }

  function generateCanvasPreview() {
    const margin = 16;

    let xSet = new Set();
    let ySet = new Set();
    for (let editPoint of props.editPoints) {
      xSet.add(editPoint.canvasWidth);
      ySet.add(editPoint.canvasHeight);
    }

    let canvasList = [];
    let originY = margin;
    let originX = margin;
    const sortedYSet = Array.from(ySet).sort((a: number, b: number) => { return a - b; });
    const sortedXSet = Array.from(xSet).sort((a: number, b: number) => { return a - b; });
    for (let y of sortedYSet) {
      originX = margin;
      for (let x of sortedXSet) {
        let currentPoint: EditPoint = null;
        let i = 0;
        for (; i < props.editPoints.length; i++) {
          if (y == props.editPoints[i].canvasHeight && x == props.editPoints[i].canvasWidth) {
            currentPoint = props.editPoints[i];
            break;
          }
        }
        if (currentPoint !== null) {
          canvasList.push(
            <div
              key={'wrapper' + x.toString() + ',' + y.toString()}
              className='wrapper'
            >
              <ImageCanvas
                key={'canvas' + x.toString() + ',' + y.toString()}
                canvasWidth={x}
                canvasHeight={y}
                image={props.image}
                currentEditPoint={currentPoint}
                viewScale={1.0}
                isEditable={false}
                isSelected={i == props.selectedIndex}
                onClick={(_) => { }}
              ></ImageCanvas>
              <style jsx>{`
                .wrapper {
                  display: block;
                  position: absolute;
                  top: ${originY}px;
                  left: ${originX}px;
                  // width: ${x}px;
                  // height: ${y}px;
                }
              `}</style>
            </div>
          );
        }
        originX += margin + x;
      }
      originY += margin + y;
    }

    return canvasList;
  }

  const fullScreenStyle = `
    .navigator {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: scroll;
      background-color: #eee;
      z-index: 100;
      transition: .2s;
      cursor: ${'zoom-out'};
    }
  `;

  const miniPanelStyle = `
    .nav-canvas {
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
      cursor: ${'zoom-in'};
    }`;

  const style = isFullScreen ? (<style jsx>{fullScreenStyle}</style>) : (<style jsx>{miniPanelStyle}</style>);
  const canvasList = generateCanvasPreview();

  console.log(canvasList);

  return (
    <div className='navigator'
      onClick={() => {
        setFullScreen(!isFullScreen);
      }}
    >
      <canvas
        ref={canvasRefContainer}
        className='nav-canvas'
        width={props.width}
        height={props.height}
        hidden={isFullScreen}
      ></canvas>
      {isFullScreen ? canvasList : null}
      {style}
    </div>
  );
}

export default Navigator;

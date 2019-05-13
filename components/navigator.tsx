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
  isLinear: boolean;
};

type Key = {
  key: number;
  origin: number;
  scale: number;
  contentLength: number;
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

function makeShadowPoints(editPoints: EditPoint[]) {
  let xKey: Key[] = [];
  let yKey: Key[] = [];
  let pointSet = new Set();
  for (const editPoint of editPoints) {
    xKey.push({
      key: editPoint.canvasWidth,
      origin: editPoint.x,
      scale: editPoint.hScale,
      contentLength: editPoint.contentWidth,
    });
    yKey.push({
      key: editPoint.canvasHeight,
      origin: editPoint.y,
      scale: editPoint.vScale,
      contentLength: editPoint.contentHeight,
    });
    pointSet.add(editPoint.canvasWidth + ',' + editPoint.canvasHeight);
  }
  xKey.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  })
  yKey.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  })
  let newEditPoints: EditPoint[] = [];
  for (const x of xKey) {
    for (const y of yKey) {
      const editPoint = new EditPoint(x.key, y.key, x.origin, y.origin, x.contentLength, y.contentLength);
      editPoint.hScale = x.scale;
      editPoint.vScale = y.scale;
      if (!pointSet.has(editPoint.canvasWidth + ',' + editPoint.canvasHeight)) newEditPoints.push(editPoint);
    }
  }
  return newEditPoints;
}

function Navigator(props: Props) {
  const canvasRefContainer = useRef();

  useEffect(() => {
    updateView();
  }, [props.width, props.height, props.editPoints, props.selectedIndex])

  const [isFullScreen, setFullScreen] = useState(false);
  useEffect(updateView);

  function updateView() {
    // console.log('update at ' + isFullScreen);
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
    if (props.isLinear) {
      let shadowPoints = makeShadowPoints(props.editPoints);
      for (let i = 0; i < shadowPoints.length; i++) {
        let x = getCanvasPos(shadowPoints[i].canvasWidth, xmin, scaleX);
        let y = getCanvasPos(shadowPoints[i].canvasHeight, ymin, scaleY);
        canvasCtx.save();
        canvasCtx.beginPath();
        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.moveTo(x, y);
        canvasCtx.arc(x, y, 4, 0, 2 * Math.PI);
        canvasCtx.fill();
        canvasCtx.closePath();
        canvasCtx.restore();
      }
    }
  }

  function generateCanvasPreview() {
    const margin = 16;
    let xKey: Key[] = [];
    let yKey: Key[] = [];

    for (let editPoint of props.editPoints) {

      xKey.push({
        key: editPoint.canvasWidth,
        origin: editPoint.x,
        scale: editPoint.hScale,
        contentLength: editPoint.contentWidth,
      });
      yKey.push({
        key: editPoint.canvasHeight,
        origin: editPoint.y,
        scale: editPoint.vScale,
        contentLength: editPoint.contentHeight,
      });
    }

    let canvasList = [];
    let originY = margin;
    let originX = margin;
    xKey.sort((a, b) => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    })
    yKey.sort((a, b) => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    })
    for (let y of yKey) {
      originX = margin;
      for (let x of xKey) {
        let currentPoint: EditPoint = null;
        let i = 0;
        for (; i < props.editPoints.length; i++) {
          if (y.key == props.editPoints[i].canvasHeight && x.key == props.editPoints[i].canvasWidth) {
            currentPoint = props.editPoints[i];
            break;
          }
        }
        if (props.isLinear && currentPoint === null) {
          currentPoint = new EditPoint(x.key, y.key, x.origin, y.origin, x.contentLength, y.contentLength);
          currentPoint.hScale = x.scale;
          currentPoint.vScale = y.scale;
        }
        if (currentPoint !== null) {
          canvasList.push(
            <div
              key={'wrapper' + x.toString() + ',' + y.toString()}
              className='wrapper'
            >
              <ImageCanvas
                key={'canvas' + x.toString() + ',' + y.toString()}
                canvasWidth={x.key}
                canvasHeight={y.key}
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
        originX += margin + x.key;
      }
      originY += margin + y.key;
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

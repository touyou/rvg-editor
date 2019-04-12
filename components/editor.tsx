/**
 * Main Editing Screen
 */

import React, { useState, useRef } from 'react';
import ImageCanvas from './imageCanvas';
import EditPoint from 'lib/editPoint';
import { NDArray } from '@bluemath/common/src';

type Props = {
  canvasWidth: number,
  canvasHeight: number,
  viewScale: number,
  image: ImageData,
  currentEditPoint: EditPoint,
  onChangeViewScale: (number) => void;
  onChangeOrigin: (NDArray) => void;
}

function Editor(props: Props) {

  return (
    <div className='editor'>
      <div className='scale-editor'>
        <button className="circular-button minus" onClick={() => {
          if (props.viewScale > 0.25) {
            props.onChangeViewScale(props.viewScale - 0.25);
          }
        }}>-</button>
        <span>{(props.viewScale * 100).toFixed(0)} %</span>
        <button className="circular-button plus" onClick={() => {
          if (props.viewScale <= 2.75) {
            props.onChangeViewScale(props.viewScale + 0.25);
          }
        }}>+</button>
      </div>
      <ImageCanvas
        canvasWidth={props.canvasWidth}
        canvasHeight={props.canvasHeight}
        image={props.image}
        currentEditPoint={props.currentEditPoint}
        viewScale={props.viewScale}
        onChangeOrigin={props.onChangeOrigin}
        isEditable={true}
      ></ImageCanvas>
      <style jsx>{`
        .editor {
          position: relative;
          width: 100%;
          height: 85%;
          background-color: #eeeeee;
          overflow: hidden;
        }
        .scale-editor {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 1;
        }
        .circular-button {
          display: inline-block;
          width: 42px;
          height: 42px;
          overflow: hidden;
          border-radius: 50%;
          margin: 8px 8px;
          padding-bottom: 4px;
          font-size: 24px;
          text-decoration: none;
          vertical-align: middle;
          text-align: center;
          cursor: pointer;
          white-space: nowrap;
        }

        .minus {
          border: none;
          background-color: #707070;
          color: #fff;
        }
        .plus {
          border: 1px #333 solid;
          background-color: #fff;
          color: #111;
        }
        span {
          font-family: 'Futura', sans-serif;
          font-weight: 300;
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}

export default Editor;

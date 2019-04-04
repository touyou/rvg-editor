/**
 * Main Editing Screen
 */

import React, { useState, useRef } from 'react';

type Props = {
  canvasWidth: number,
  canvasHeight: number,
  viewScale: number,
  onChangeViewScale: (number) => void;
}

function Editor(props: Props) {
  const canvasRefContainer = useRef(null);

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
      <canvas
        ref={canvasRefContainer}
        width={props.canvasWidth * props.viewScale}
        height={props.canvasHeight * props.viewScale}>
      </canvas>
      <style jsx>{`
        .editor {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: #eeeeee;
        }
        .scale-editor {
          position: absolute;
          top: 8px;
          left: 8px;
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
        canvas {
          position: absolute;
          display: block;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          margin: auto;
          background-color: #ffffff;
        }
      `}</style>
    </div>
  )
}

export default Editor;

/**
 * Main Editing Screen
 */

import React, { useState, useRef } from 'react';
import ImageCanvas from './imageCanvas';
import EditPoint from 'lib/editPoint';
import { NDArray } from '@bluemath/common/src';
import CircleButton from './circleButton';

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
        <CircleButton
          border='none'
          backgroundColor='#707070'
          color='#fff'
          onClick={() => {
            if (props.viewScale > 0.25) {
              props.onChangeViewScale(props.viewScale - 0.25);
            }
          }}
        >-</CircleButton>
        <span>{(props.viewScale * 100).toFixed(0)} %</span>
        <CircleButton
          border='1px #333 solid'
          backgroundColor='#fff'
          color='#111'
          onClick={() => {
            if (props.viewScale <= 2.75) {
              props.onChangeViewScale(props.viewScale + 0.25);
            }
          }}
        >+</CircleButton>
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

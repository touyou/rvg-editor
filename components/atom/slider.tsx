/**
 * Slider Component
 */

import React, { useState } from 'react';
import CircleButton from './circleButton';

type Props = {
  title: string;
  imageName: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  step: number;
  onChange: (number: number) => void;
}

function Slider(props: Props) {
  const [isEditKeyboard, setKeyboadMode] = useState(false);
  const [editValue, setEditValue] = useState(props.value);

  return (
    <div className='slider-container'>
      <h3>
        <img src={props.imageName}></img>{props.title}: {isEditKeyboard ?
          (<input type='number' value={editValue} min={props.min} max={props.max} onChange={(e) => {
            setEditValue(Number(e.target.value));
          }} />) : Number(props.value).toFixed(2)} {props.unit}
        <CircleButton
          border='none'
          color='#fff'
          backgroundColor='#707070'
          onClick={() => {
            if (isEditKeyboard) {
              props.onChange(editValue);
            }
            setKeyboadMode(!isEditKeyboard);
          }}
        >
          <img src={isEditKeyboard ? '../static/done-icon.svg' : '../static/edit-icon.svg'}
            style={{ width: isEditKeyboard ? '1em' : '0.5em', verticalAlign: 'middle' }} />
        </CircleButton>
      </h3>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
        onChange={(event) => {
          props.onChange(Number(event.target.value))
          setEditValue(Number(event.target.value))
        }}
        className="slider"
      />

      <style jsx>{`
        .slider-container {
          clear: both;
        }
        h3 {
          font-family: 'Futura', sans-serif;
          font-weight: 500;
          font-size: 0.8rem;
          // color: #707070;
          color: #eee;
          margin-bottom: 0px;
          margin-top: 0px
        }
        img {
          width: 4em;
          padding-right: 16px;
          vertical-align: middle;
        }
        .slider {
          -webkit-appearance: none;
          width: 90%;
          height: 5px;
          border-radius: 2px;
          // background: #707070;
          background-color: #eee;
          outline: none;
          opacity: 0.9;
          transition: opacity .2s;
          margin-bottom: 1.8em;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-style: solid;
          border-width: 1.5px;
          border-color: #707070;
          border-radius: 50%;
          background: #ffffff;
          // background-color: #707070;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-style: solid;
          border-width: 1.5px;
          border-color: #707070;
          border-radius: 50%;
          background: #ffffff;
          // background-color: #707070;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default Slider;

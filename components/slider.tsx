/**
 * Slider Component
 */

import React, { useState } from 'react';

type Props = {
  title: string;
  imageName: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  step: number;
  onChange: (number) => void;
}

function Slider(props: Props) {

  return (
    <div className='slider-container'>
      <h3><img src={props.imageName}></img>{props.title}: {Number(props.value).toFixed(2)} {props.unit}</h3>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
        onChange={(event) => {
          props.onChange(event.target.value)
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
          color: #707070;
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
          background: #707070;
          outline: none;
          opacity: 0.7;
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
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default Slider;

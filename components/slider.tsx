/**
 * Slider Component
 */

import React, { useState } from 'react';

type Props = {
  title: string;
  unit: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
  onChange: (number) => void;
}

function Slider(props: Props) {
  const [value, setValue] = useState(props.defaultValue);

  return (
    <div className='slider-container'>
      <h3>{props.title}: {value} {props.unit}</h3>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={value}
        step={props.step}
        onChange={(event) => {
          props.onChange(event.target.value)
          setValue(event.target.value)
        }}
        className="slider"
      />

      <style jsx>{`
        h3 {
          font-size: 0.7rem;
          color: #707070;
          margin-bottom: 0px;
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
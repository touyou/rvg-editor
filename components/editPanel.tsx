/**
 * Adjusting Parameters Panel
 */
import React, { useState } from 'react';

function EditPanel() {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(50);

  return (
    <div className='editpanel'>
      <h3>Value1: {value1}</h3>
      <input type="range" min="0" max="100" value={value1} className="slider" onChange={(event) => { setValue1(event.target.value) }} />
      <h3>Value2: {value2}</h3>
      <input type="range" min="0" max="100" value={value2} className="slider" onChange={(event) => { setValue2(event.target.value) }} />
      <style jsx>{`
        .editpanel {
          flex: 1 1 auto;
          padding: 8px;
        }

        h3 {
          font-size: 1.0rem;
          margin-bottom: 0px;
        }
        .slider {
          -webkit-appearance: none;
          width: 90%;
          height: 6px;
          border-radius: 2px;
          background: #d3d3d3;
          outline: none;
          opacity: 0.7;
          transition: opacity .2s;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #4CAF50;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #4CAF50;
          cursor: pointer;
        }
        `}</style>
    </div>
  )
}

export default EditPanel;

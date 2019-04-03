/**
 * Switch Component
 */

import React, { useState } from 'react';

type Props = {
  onChange: (boolean) => void;
}

function Switch(props: Props) {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className='switch-container'>
      <p>Aspect Lock Scaling</p>
      <label className="switch">
        <input
          type="checkbox"
          onChange={(event) => {
            props.onChange(!isLocked)
            setIsLocked(!isLocked)
          }}
        />
        <span className="slider"></span>
      </label>
      <style jsx>{`
        .switch-container {
          font-family: 'Futura', sans-serif;
          font-weight: 500;
          font-size: 0.8rem;
          color: #707070;
          float: right;
          height: 1.8em;
          line-height: 1.8em;
          margin-right: 2em;
        }
        p {
          position: relative;
          display: inline-block;
          height: 1.8em;
          margin-bottom: 1.8em;
          margin-top: 0;
          vertical-align: middle;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 3.2em;
          height: 1.8em;
          margin-bottom: 1.8em;
          margin-left: 0.3em;
          vertical-align: middle;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 1.8em;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 1.4em;
          width: 1.4em;
          left: 0.2em;
          bottom: 0.2em;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #707070;
        }
        input:focus + .slider {
          box-shadow: 0 0 1px #707070;
        }
        input:checked + .slider:before {
          -webkit-transform: translateX(1.4em);
          -ms-transform: translateX(1.4em);
          transform: translateX(1.4em);
        }
      `}
      </style>
    </div>
  )
}

export default Switch;

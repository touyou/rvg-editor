/**
 * Text Field
 */

import React, { useEffect } from 'react';

type Props = {
  placeholder: string;
  value: string;
  onChange: (string) => void;
}

function TextField(props: Props) {

  return (
    <div className='textfield'>
      <p>{props.placeholder}</p>
      <input
        type='text'
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event) => {
          props.onChange(event.target.value);
        }}
      ></input>
      <style jsx>{`
        .textfield {
          display: block;
        }
        p {
          display: inline-block;
          width: 3em;
          margin-right: 8px;
          font-family: 'Futura', sans-serif;
          font-weight: 500;
          font-size: 1rem;
        }
        input[type=text] {
          display: inline-block;
          border: 2px solid #f0f0f0;
          border-radius: 4px;
          padding: 4px;
          outline: none;
          transition: 0.3s;
        }
        input[type=text]:focus {
          border-color: #707070;
        }
      `}</style>
    </div>
  );
}

export default TextField;

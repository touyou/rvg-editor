/**
 * List Item Buttons
 */

import React from 'react';

type Props = {
  value: string;
  onClick: () => void;
}

function ListButton(props: Props) {
  return (
    <>
      <button
        onClick={() => { props.onClick() }}
      >{props.value}
        <style jsx>{`
        button {
          display: inline-block;
          width: 90%;
          height: 45px;
          text-decoration: none;
          background-color: #f0f0f0;
          color: #707070;
          border: none;
          margin: 8px;
          transition: .4s;
          font-family: "Futura", sans-serif;
          font-weight: 500;
          font-size: 0.8rem;
          cursor: pointer;
          outline: none;
        }
        button:hover {
          background-color: #707070;
          color: white;
        }
      `}</style>
      </button>
    </>
  );
}

export default ListButton;

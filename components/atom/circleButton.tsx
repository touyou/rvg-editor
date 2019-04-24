/**
 * Circle Button
 */

import React, { FunctionComponent } from "react";

type Props = {
  border: string;
  color: string;
  backgroundColor: string;
  onClick: () => void;
};

const CircleButton: FunctionComponent<Props> = (props) => {
  return (
    <button
      className="circular-button"
      onClick={props.onClick}>
      {props.children}
      <style jsx>{`
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
          outline: none;
          border: ${props.border};
          background-color: ${props.backgroundColor};
          color: ${props.color};
          transition: .2s;
        }

        .circular-button:hover {
          opacity: 0.2;
        }
      `}</style>
    </button>
  );
}

export default CircleButton;

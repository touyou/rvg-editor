/**
 * Adjusting Parameters Panel
 */
import React, { useState } from 'react';
import Slider from './slider';
import Switch from './switch';
import EditPoint from '../lib/editPoint';

type Props = {
  point: EditPoint;
  onChange: (EditPoint) => void;
}

function EditPanel(props: Props) {
  // const [params, setParams] = useState({
  //   width: 50,
  //   height: 50,
  //   hScale: 1.0,
  //   vScale: 1.0,
  //   cWidth: 50,
  //   cHeight: 50,
  // });
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className='editpanel'>
      <div className='edit-section'>
        <Slider
          title='Canvas Width'
          imageName='static/canvas_width.svg'
          unit='px'
          min={0}
          max={3840}
          value={props.point.canvasWidth}
          step={1}
          onChange={(value) => {
            const newValue = props.point.clone();
            newValue.canvasWidth = value;
            props.onChange(newValue);
          }}
        />
        <Slider
          title='Canvas Height'
          imageName='static/canvas_height.svg'
          unit='px'
          min={0}
          max={3840}
          value={props.point.canvasHeight}
          step={1}
          onChange={(value) => {
            const newValue = props.point.clone();
            newValue.canvasHeight = value;
            props.onChange(newValue);
          }}
        />
      </div>
      <div className='edit-section'>
        <Slider
          title='Horizontal Scale'
          imageName='static/width_scale.svg'
          unit='x'
          min={0}
          max={10}
          value={props.point.hScale}
          step={0.1}
          onChange={(value) => {
            const newValue = props.point.clone();
            newValue.hScale = value;
            if (isLocked) {
              newValue.vScale = props.point.vScale - (props.point.hScale - value);
            }
            props.onChange(newValue);
          }}
        />
        <Slider
          title='Vertical Scale'
          imageName='static/height_scale.svg'
          unit='x'
          min={0}
          max={10}
          value={props.point.vScale}
          step={0.1}
          onChange={(value) => {
            const newValue = props.point.clone();
            newValue.vScale = value;
            if (isLocked) {
              newValue.hScale = props.point.hScale - (props.point.vScale - value);
            }
            props.onChange(newValue);
          }}
        />
        <Switch onChange={(value) => {
          setIsLocked(value);
        }} />
      </div>
      <div className='edit-section'>
        <Slider
          title='Content Width'
          imageName='static/content_width.svg'
          unit='px'
          min={0}
          max={3840}
          value={props.point.contentWidth}
          step={1}
          onChange={(value) => {
            const newValue = props.point.clone();
            newValue.contentWidth = value;
            props.onChange(newValue);
          }}
        />
        <Slider
          title='Content Height'
          imageName='static/content_height.svg'
          unit='px'
          min={0}
          max={3840}
          value={props.point.contentHeight}
          step={1}
          onChange={(value) => {
            const newValue = props.point.clone();
            newValue.contentHeight = value;
            props.onChange(newValue);
          }}
        />
      </div>
      <style jsx>{`
        .editpanel {
          flex: 1 1 auto;
          padding: 8px;
        }
        .edit-section {
          margin-bottom: 3.5em;
        }
        `}</style>
    </div>
  )
}

export default EditPanel;

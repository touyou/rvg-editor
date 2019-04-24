/**
 * Adjusting Parameters Panel
 */
import React, { useState } from 'react';
import Slider from './slider';
import Switch from './switch';
import EditPoint from '../lib/editPoint';
import CircleButton from './circleButton';

type Props = {
  point: EditPoint;
  imageWidth: number;
  imageHeight: number;
  onChange: (EditPoint) => void;
  onAddPoint: () => void;
}

function EditPanel(props: Props) {
  const [isLocked, setIsLocked] = useState(false);

  if (props.point == null) {
    return (
      <div className='editpanel'>
        <style jsx>{`
        .editpanel {
          flex: 1 1 auto;
          padding: 8px;
        }
        `}</style>
      </div >
    )
  }

  return (
    <div className='editpanel'>
      <div className='edit-buttons'>
        <CircleButton
          border='none'
          backgroundColor='#eee'
          color='#fff'
          onClick={() => {
            props.onAddPoint();
          }}
        >
          <img
            src='../static/keyframe-icon.svg'
            style={{ width: '1em', verticalAlign: 'middle' }}
          />
        </CircleButton>
      </div>
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
          min={1}
          max={props.imageWidth * 2}
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
          min={1}
          max={props.imageWidth * 2}
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
          background-color: #707070;
        }
        .edit-section {
          margin-top: 8px;
          // margin-bottom: 3.5em;
        }
        .edit-buttons img {
          width: 1em;
          vertical-align: middle;
        }
        `}</style>
    </div>
  )
}

export default EditPanel;

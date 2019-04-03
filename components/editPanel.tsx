/**
 * Adjusting Parameters Panel
 */
import React, { useState } from 'react';
import Slider from './slider';
import Switch from './switch';

function EditPanel() {
  const [params, setParams] = useState({
    width: 50,
    height: 50,
    hScale: 1.0,
    vScale: 1.0,
    cWidth: 50,
    cHeight: 50,
  });
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className='editpanel'>
      <div className='edit-section'>
        <Slider
          title='Canvas Width'
          imageName='static/canvas_width.svg'
          unit='px'
          min={0}
          max={100}
          value={params.width}
          step={1}
          onChange={(value) => {
            setParams({ ...params, width: value })
          }}
        />
        <Slider
          title='Canvas Height'
          imageName='static/canvas_height.svg'
          unit='px'
          min={0}
          max={100}
          value={params.height}
          step={1}
          onChange={(value) => {
            setParams({ ...params, height: value })
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
          value={params.hScale}
          step={0.1}
          onChange={(value) => {
            if (isLocked) {
              setParams({
                ...params,
                hScale: value,
                vScale: params.vScale - (params.hScale - value),
              })
            } else {
              setParams({ ...params, hScale: value })
            }
          }}
        />
        <Slider
          title='Vertical Scale'
          imageName='static/height_scale.svg'
          unit='x'
          min={0}
          max={10}
          value={params.vScale}
          step={0.1}
          onChange={(value) => {
            if (isLocked) {
              setParams({
                ...params,
                vScale: value,
                hScale: params.hScale - (params.vScale - value),
              })
            } else {
              setParams({ ...params, vScale: value })
            }
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
          max={100}
          value={params.cWidth}
          step={1}
          onChange={(value) => {
            setParams({ ...params, cWidth: value })
          }}
        />
        <Slider
          title='Content Height'
          imageName='static/content_height.svg'
          unit='px'
          min={0}
          max={100}
          value={params.cHeight}
          step={1}
          onChange={(value) => {
            setParams({ ...params, cHeight: value })
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

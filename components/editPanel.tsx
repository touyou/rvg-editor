/**
 * Adjusting Parameters Panel
 */
import React, { useState } from 'react';
import Slider from './slider';

function EditPanel() {
  const [value, setValue] = useState(50);

  return (
    <div className='editpanel'>
      <Slider
        title='Canvas Width'
        unit='px'
        min={0}
        max={100}
        defaultValue={50}
        step={1}
        onChange={(value) => {
          setValue(value)
        }}
      />
      <Slider
        title='Canvas Height'
        unit='px'
        min={0}
        max={100}
        defaultValue={50}
        step={1}
        onChange={(value) => {
        }}
      />
      <Slider
        title='Horizontal Scale'
        unit='x'
        min={0}
        max={10}
        defaultValue={1.0}
        step={0.1}
        onChange={(value) => {
        }}
      />
      <Slider
        title='Vertical Scale'
        unit='x'
        min={0}
        max={10}
        defaultValue={1.0}
        step={0.1}
        onChange={(value) => {
        }}
      />
      <Slider
        title='Content Width'
        unit='px'
        min={0}
        max={100}
        defaultValue={50}
        step={1}
        onChange={(value) => {
        }}
      />
      <Slider
        title='Content Height'
        unit='px'
        min={0}
        max={100}
        defaultValue={50}
        step={1}
        onChange={(value) => {
        }}
      />
      <p>{value}</p>
      <style jsx>{`
        .editpanel {
          flex: 1 1 auto;
          padding: 8px;
        }
        `}</style>
    </div>
  )
}

export default EditPanel;

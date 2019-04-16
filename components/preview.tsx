/**
 * Preview Screen
 */
import React from 'react';
import { templates, Device } from '../lib/templateSize';

class Preview extends React.Component {
  render() {
    let sizeList = [];
    Object.entries(templates).forEach((value) => {
      sizeList.push(<p key={value[0]}>{(value[1] as Device).name}</p>);
    });

    return (
      <div className='preview'>
        <p>This is Preview Area</p>
        {sizeList}
        <style jsx>{`
        .preview {
          overflow-y: scroll;
          flex: 1 1 auto;
        }
        `}</style>
      </div>
    )
  }
}

export default Preview;

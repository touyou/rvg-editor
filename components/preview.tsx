/**
 * Preview Screen
 */
import React from 'react';

class Preview extends React.Component {
  render() {
    return (
      <div className='preview'>
        <p>This is Preview Area</p>
        <style jsx>{`
        .preview {
          background-color: blue;
          flex: 1 1 auto;
        }
        `}</style>
      </div>
    )
  }
}

export default Preview;

import Editor from '../components/editor';
import EditPanel from '../components/editPanel';
import Preview from '../components/preview';
import { RBF } from '../lib/rbf';
import EditPoint from '../lib/editPoint';
import { NDArray } from '@bluemath/common';
import React from 'react';
import Head from 'next/head';

function testRbf() {
  let rbf = new RBF();
  let y = new NDArray([
    [3.0],
    [4.0],
    [6.0],
    [2.0]
  ]);
  let A = [
    new NDArray([1.0, 2.0]),
    new NDArray([2.0, 3.0]),
    new NDArray([1.0, 4.0]),
    new NDArray([3.0, 4.0]),
  ];
  let weight = rbf.computeWeights(y, A);
  return (
    <div>
      <p>(2, 3.5): {rbf.interpolate(new NDArray([2.0, 3.5]), A, weight)}</p>
      <p>(1, 0.5): {rbf.interpolate(new NDArray([1.0, 0.5]), A, weight)}</p>
      <p>(3, 4): {rbf.interpolate(new NDArray([3.0, 4.0]), A, weight)}</p>
    </div>
  );
}

interface IMainState {
  pointList?: Array<EditPoint>,
  selectIndex?: number,
  viewScale?: number,
}

class Main extends React.Component<{}, IMainState> {
  public state: IMainState = {
    // demo
    pointList: [
      new EditPoint(100, 200, 300, 200),
      new EditPoint(400, 200, 300, 20),
      new EditPoint(10, 200, 100, 200)
    ],
    selectIndex: 0,
    viewScale: 1.0,
  };

  get currentPoint() {
    return this.state.pointList[this.state.selectIndex]
  }

  render() {
    return (
      <div className='root'>
        <Head>
          <title>RVG Editor</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
          <style>
            {`
@font-face {
  font-family: 'Futura';
  src: url('../static/Futura-Lig.ttf') format('truetype');
  font-weight: 300;
}
@font-face {
  font-family: 'Futura';
  src: url('../static/Futura-Boo.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'Futura';
  src: url('../static/Futura-Med.ttf') format('truetype');
  font-weight: 500;
}
@font-face {
  font-family: 'Futura';
  src: url('../static/Futura-Dem.ttf') format('truetype');
  font-weight: 600;
}
@font-face {
  font-family: 'Futura';
  src: url('../static/Futura-Bol.ttf') format('truetype');
  font-weight: 700;
}
@font-face {
  font-family: 'Futura';
  src: url('../static/Futura-ExtBol.ttf') format('truetype');
  font-weight: 800;
}
            `}
          </style>
        </Head>

        {/* <p>{testRbf()}</p> */}
        <div className='main'>
          <Editor
            canvasWidth={this.currentPoint.canvasWidth}
            canvasHeight={this.currentPoint.canvasHeight}
            viewScale={this.state.viewScale}
            onChangeViewScale={(value) => {
              this.setState({ viewScale: value });
            }}
          />
        </div>
        <div className='sidepanel'>
          <Preview></Preview>
          <EditPanel
            point={this.currentPoint}
            onChange={(value) => {
              const pointCopy = this.state.pointList.slice();
              pointCopy[this.state.selectIndex] = value;
              this.setState({
                pointList: pointCopy
              });
            }}></EditPanel>
        </div>

        <style jsx>{`
        .root {
          margin: 0 auto;
          padding: 0;
          height: 100%;
          display: flex;
          flex-direction: row;
        }
        .main {
          flex: 8 1 auto;
        }
        .sidepanel {
          flex: 1 1 auto;

          display: flex;
          flex-direction: column
        }

        .editpanel {
          background-color: green;
          flex: 0 1 auto;
        }
        `}</style>
        <style jsx global>{`
        #__next {
          height: 100vh;
        }
        body {
          margin: 0 auto;
          height: 100vh;
        }
        html {
          height: 100vh;
        }
        `}</style>
      </div>
    );
  }
}

export default Main

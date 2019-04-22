import Editor from '../components/editor';
import EditPanel from '../components/editPanel';
import Preview from '../components/preview';
import { RBF } from '../lib/rbf';
import EditPoint from '../lib/editPoint';
import { NDArray } from '@bluemath/common';
import React from 'react';
import Head from 'next/head';
import ImageCanvas from '../components/imageCanvas';
import SeamCarver from '../lib/seamCarver';
import { templates, Device } from '../lib/templateSize';
import ListButton from '../components/listButton';
import TextField from '../components/textField';
import { Resizer } from '../lib/resizer';

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
  isBottomAppear: boolean,
  image?: ImageData,
  isModalOpen: boolean,
  inputWidth: number,
  inputHeight: number,
  previewFullScreen: boolean,
}

class Main extends React.Component<{}, IMainState> {
  public state: IMainState = {
    pointList: [
    ],
    selectIndex: 0,
    viewScale: 1.0,
    isBottomAppear: false,
    image: null,
    isModalOpen: false,
    inputWidth: 0,
    inputHeight: 0,
    previewFullScreen: false,
  };
  private _seamCarver: SeamCarver;
  private _resizer: Resizer;

  get currentPoint() {
    return this.state.pointList[this.state.selectIndex]
  }

  componentDidMount() {
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    let image = new Image();
    image.src = 'static/bicycle2.png';
    image.onload = () => {
      tmpCanvas.width = image.naturalWidth;
      tmpCanvas.height = image.naturalHeight;
      tmpCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      this._seamCarver = new SeamCarver(tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight));
      this.setState({
        image: tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight), pointList: [new EditPoint(image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)],
        inputWidth: image.naturalWidth,
        inputHeight: image.naturalHeight,
      });
    }
    this._resizer = new Resizer();
  }

  render() {
    let canvasList: any[] = [];
    for (let i = 0; i < this.state.pointList.length; i++) {
      const factor = 200 / this.state.pointList[i].canvasHeight * 0.75;
      canvasList.push(
        <ImageCanvas
          key={'canvas' + i.toString()}
          id={i}
          canvasWidth={this.state.pointList[i].canvasWidth}
          canvasHeight={this.state.pointList[i].canvasHeight}
          image={this._seamCarver == null ? this.state.image : this._seamCarver.resize(this.state.pointList[i].contentWidth, this.state.pointList[i].contentHeight)}
          currentEditPoint={this.state.pointList[i]}
          viewScale={factor}
          isSelected={i == this.state.selectIndex}
          onClick={() => {
            this.setState({ selectIndex: i });
          }}
        ></ImageCanvas>
      )
    }
    let sizeList = [
      <ListButton key='original-button' onClick={() => {
        this.setState({
          inputWidth: this.state.image.width,
          inputHeight: this.state.image.height,
        })
      }} value='Original'></ListButton>
    ];
    Object.entries(templates).forEach((value) => {
      const key: string = value[0];
      const device: Device = value[1];
      sizeList.push(
        <ListButton key={key} onClick={() => {
          this.setState({
            inputWidth: device.width,
            inputHeight: device.height,
          })
        }} value={device.name}></ListButton>
      );
    });

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
            canvasWidth={this.state.pointList.length == 0 ? 0 : this.currentPoint.canvasWidth}
            canvasHeight={this.state.pointList.length == 0 ? 0 : this.currentPoint.canvasHeight}
            viewScale={this.state.viewScale}
            image={this._seamCarver == null ? this.state.image : this._seamCarver.resize(this.state.pointList[this.state.selectIndex].contentWidth, this.state.pointList[this.state.selectIndex].contentHeight)}
            currentEditPoint={this.state.pointList[this.state.selectIndex]}
            onChangeViewScale={(value) => {
              this.setState({ viewScale: value });
            }}
            onChangeOrigin={(value) => {
              const pointCopy = this.state.pointList.slice();
              const newPoint = pointCopy[this.state.selectIndex].clone();
              newPoint.x = value.data[0];
              newPoint.y = value.data[1];
              pointCopy[this.state.selectIndex] = newPoint;
              this.setState({ pointList: pointCopy });
            }}
          />
          <div className='bottompanel'>
            {canvasList}
          </div>
        </div>
        <div className='sidepanel'>
          <Preview
            editPoints={this.state.pointList}
            width={this.state.image != null ? this.state.image.width : 0}
            height={this.state.image != null ? this.state.image.height : 0}
            image={this.state.image}
            resizer={this._seamCarver != null ? this._resizer.getResizer(true, this.state.pointList, this._seamCarver) : null}
            onChangeMode={() => {
              this.setState({ previewFullScreen: !this.state.previewFullScreen });
            }}
            isFullScreen={this.state.previewFullScreen}
          ></Preview>
          <EditPanel
            point={this.currentPoint}
            imageWidth={this.state.image != null ? this.state.image.width : 0}
            imageHeight={this.state.image != null ? this.state.image.height : 0}
            onAddPoint={() => {
              this.setState({
                isModalOpen: true,
              });
            }}
            onChange={(value) => {
              const pointCopy = this.state.pointList.slice();
              pointCopy[this.state.selectIndex] = value;
              this.setState({
                pointList: pointCopy
              });
            }}></EditPanel>
        </div>
        <div className={this.state.isModalOpen ? 'modal' : 'close'}>
          <div className='device-list'>
            {sizeList}
          </div>
          <div className='input-area'>
            <button className="circular-button" onClick={() => {
              this.setState({ isModalOpen: false });
            }}>×</button>
            <TextField
              placeholder='width'
              value={this.state.inputWidth.toString()}
              onChange={(value) => {
                const number = Number(value);
                this.setState({
                  inputWidth: number,
                });
              }}></TextField>
            <TextField
              placeholder='height'
              value={this.state.inputHeight.toString()}
              onChange={(value) => {
                const number = Number(value);
                this.setState({
                  inputHeight: number,
                });
              }}></TextField>
            <ListButton key='switch-button' onClick={() => {
              this.setState({
                inputWidth: this.state.inputHeight,
                inputHeight: this.state.inputWidth,
              });
            }} value='Switch'></ListButton>
            <ListButton key='add-button' onClick={() => {
              const newPoint = new EditPoint(this.state.inputWidth, this.state.inputHeight, 0, 0, this.state.image.width, this.state.image.height);
              const pointCopy = this.state.pointList.slice();
              pointCopy.push(newPoint);
              this.setState({
                pointList: pointCopy,
                isModalOpen: false,
                inputWidth: this.state.image.width,
                inputHeight: this.state.image.height,
              });
            }} value='Add'></ListButton>
          </div>
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
          display: block;
          position: relative;
          flex: 8 1 auto;
          clear: both;
        }
        .modal {
          position: absolute;
          display: block;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          margin: auto;
          background-color: #ffffff;
          width: 50%;
          height: 50%;
          box-shadow: 0 0 3px 5px rgba(0,0,0,0.1);
        }
        .close {
          display: none;
        }
        .device-list {
          display: inline-block;
          width: 40%;
          height: 100%;
          overflow-y: scroll;
          overflow-x: hidden;
          float: left;
        }
        .input-area {
          display: inline-block;
          width: 54%;
          height: 90%;
          float: right;
          padding: 8px;
        }
        .sidepanel {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          clear: both;
          border-left: 4px solid #555;
        }
        .editpanel {
          flex: 0 1 auto;
          clear: both;
        }
        .bottompanel {
          position: absolute;
          overflow-x: scroll;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 180px;
          white-space: nowrap;
          background-color: #eee;
          vertical-align: middle;
          clear: both;
        }
        .circular-button {
          display: inline-block;
          width: 24px;
          height: 24px;
          overflow: hidden;
          margin: 8px 8px;
          padding-bottom: 4px;
          font-size: 15px;
          text-decoration: none;
          vertical-align: middle;
          text-align: center;
          cursor: pointer;
          white-space: nowrap;
          float:right;
          outline: none;
          border-radius: 50%;
          border: none;
          background-color: #fff;
          color: #707070;
          transition: 0.3s;
        }
        .circular-button:hover {
          background-color: #707070;
          color: #fff;
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
      </div >
    );
  }
}

export default Main

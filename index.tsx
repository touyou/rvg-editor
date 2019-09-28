import Editor from '../components/editor';
import EditPanel from '../components/editPanel';
import Preview from '../components/preview';
import EditPoint from '../lib/editPoint';
import React from 'react';
import Head from 'next/head';
import ImageCanvas from '../components/atom/imageCanvas';
import SeamCarver from '../lib/seamCarver';
import { templates, Device } from '../lib/templateSize';
import ListButton from '../components/atom/listButton';
import TextField from '../components/atom/textField';
import { Resizer, Key } from '../lib/resizer';
import Navigator from '../components/navigator';
// import * as zip from '../lib/multi_resizer/zip';
import * as JSZip from 'jszip';

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
  resizeMode: number,
  imageName: string,
  xKeys: Key[],
  yKeys: Key[],
}

class Main extends React.Component<{}, IMainState> {
  public state: IMainState = {
    pointList: [
    ],
    xKeys: [],
    yKeys: [],
    selectIndex: 0,
    viewScale: 1.0,
    isBottomAppear: false,
    image: null,
    isModalOpen: false,
    inputWidth: 0,
    inputHeight: 0,
    previewFullScreen: false,
    resizeMode: 0,
    imageName: 'image.rvg',
  };
  private _seamCarver: SeamCarver;
  private _resizer: Resizer;

  get currentPoint() {
    return this.state.pointList[this.state.selectIndex]
  }

  get isLinear() {
    return this.state.resizeMode == 0;
  }

  loadImage(url, metainfo: Object | null = null) {
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    let image = new Image();
    image.src = url;
    image.onload = () => {
      tmpCanvas.width = image.naturalWidth;
      tmpCanvas.height = image.naturalHeight;
      tmpCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      this._seamCarver = new SeamCarver(tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight));
      this.setState({
        image: tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight),
        pointList: [new EditPoint(image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)],
        xKeys: [{ key: image.naturalWidth, origin: 0, scale: 1.0, contentLength: image.naturalWidth }],
        yKeys: [{ key: image.naturalHeight, origin: 0, scale: 1.0, contentLength: image.naturalHeight }],
        inputWidth: image.naturalWidth,
        inputHeight: image.naturalHeight,
      });
    }
    if (metainfo === null) {
      image.onload = () => {
        tmpCanvas.width = image.naturalWidth;
        tmpCanvas.height = image.naturalHeight;
        tmpCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        this._seamCarver = new SeamCarver(tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight));
        this.setState({
          image: tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight),
          pointList: [new EditPoint(image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)],
          xKeys: [{ key: image.naturalWidth, origin: 0, scale: 1.0, contentLength: image.naturalWidth }],
          yKeys: [{ key: image.naturalHeight, origin: 0, scale: 1.0, contentLength: image.naturalHeight }],
          inputWidth: image.naturalWidth,
          inputHeight: image.naturalHeight,
        });
      }
    } else {
      let linear: boolean = metainfo['linear'];
      let pointList: EditPoint[] = [];
      let xKeys: Key[] = [];
      let yKeys: Key[] = [];
      if (linear) {
        let originXKeys: number[][] = metainfo['keys']['originXKeys'];
        let originYKeys: number[][] = metainfo['keys']['originYKeys'];
        let widthKeys: number[][] = metainfo['keys']['widthKeys'];
        let heightKeys: number[][] = metainfo['keys']['heightKeys'];
        let scaleXKeys: number[][] = metainfo['keys']['scaleXKeys'];
        let scaleYKeys: number[][] = metainfo['keys']['scaleYKeys'];
        for (let i = 0; i < originXKeys.length; i++) {
          xKeys.push({
            key: originXKeys[i][0],
            origin: originXKeys[i][1],
            scale: scaleXKeys[i][1],
            contentLength: widthKeys[i][1],
          });
        }
        for (let i = 0; i < originYKeys.length; i++) {
          yKeys.push({
            key: originYKeys[i][0],
            origin: originYKeys[i][1],
            scale: scaleYKeys[i][1],
            contentLength: heightKeys[i][1],
          });
        }
        for (const xKey of xKeys) {
          for (const yKey of yKeys) {
            pointList.push(new EditPoint(xKey.key, yKey.key, xKey.origin, yKey.origin, xKey.contentLength, yKey.contentLength, xKey.scale, yKey.scale));
          }
        }
      } else {
        let keys = metainfo['keys'];
        for (const key of keys) {
          const editPoint = new EditPoint(key['width'], key['height'], key['originX'], key['originY'], key['contentWidth'], key['contentHeight'], key['hScale'], key['vScale']);
          pointList.push(editPoint);
          xKeys.push({
            key: editPoint.canvasWidth,
            origin: editPoint.x,
            scale: editPoint.hScale,
            contentLength: editPoint.contentWidth,
          });
          yKeys.push({
            key: editPoint.canvasHeight,
            origin: editPoint.y,
            scale: editPoint.vScale,
            contentLength: editPoint.contentHeight,
          });
        }
      }
      image.onload = () => {
        tmpCanvas.width = image.naturalWidth;
        tmpCanvas.height = image.naturalHeight;
        tmpCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        this._seamCarver = new SeamCarver(tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight));
        this.setState({
          image: tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight),
          pointList: pointList,
          xKeys: xKeys,
          yKeys: yKeys,
          inputWidth: image.naturalWidth,
          inputHeight: image.naturalHeight,
          resizeMode: linear ? 0 : 1,
        });
      }
    }
    this._resizer = new Resizer();
  }

  loadFile(file) {
    const zip = new JSZip();
    JSZip.loadAsync(file).then((zip) => {
      zip.file('metainfo.json').async('string').then((text) => {
        const metainfo = JSON.parse(text);
        zip.file('image.png').async('blob').then((blob) => {
          this.loadImage(URL.createObjectURL(blob), metainfo);
        })
      });
    })
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
              const newValue = pointCopy[this.state.selectIndex].clone();
              newValue.x = value.data[0];
              newValue.y = value.data[1];
              pointCopy[this.state.selectIndex] = newValue;
              const xKeyCopy = this.state.xKeys.slice();
              const yKeyCopy = this.state.yKeys.slice();
              for (let i = 0; i < xKeyCopy.length; i++) {
                if (newValue.canvasWidth == xKeyCopy[i].key) {
                  xKeyCopy[i].scale = newValue.hScale;
                  if (this.isLinear) {
                    for (let j = 0; j < pointCopy.length; j++) {
                      if (newValue.canvasWidth == pointCopy[j].canvasWidth) {
                        pointCopy[j].x = newValue.x;
                      }
                    }
                  }
                  break;
                }
              }
              for (let i = 0; i < yKeyCopy.length; i++) {
                if (newValue.canvasHeight == yKeyCopy[i].key) {
                  yKeyCopy[i].origin = newValue.y;
                  if (this.isLinear) {
                    for (let j = 0; j < pointCopy.length; j++) {
                      if (newValue.canvasHeight == pointCopy[j].canvasHeight) {
                        pointCopy[j].y = newValue.y;
                      }
                    }
                  }
                  break;
                }
              }
              this.setState({ pointList: pointCopy, xKeys: xKeyCopy, yKeys: yKeyCopy });
            }}
          />
          <div className='bottompanel'>
            {canvasList}
          </div>
          <Navigator
            image={this.state.image}
            width={200}
            height={200}
            editPoints={this.state.pointList}
            selectedIndex={this.state.selectIndex}
            isLinear={this.isLinear}
            xKeys={this.state.xKeys}
            yKeys={this.state.yKeys}
          ></Navigator>
        </div>
        <div className='sidepanel'>
          <Preview
            editPoints={this.state.pointList}
            width={this.state.image != null ? this.state.image.width : 0}
            height={this.state.image != null ? this.state.image.height : 0}
            image={this.state.image}
            resizer={this._seamCarver != null ? this._resizer.getResizer(this.isLinear, this.state.pointList, this._seamCarver) : null}
            resizeMode={this.state.resizeMode}
            onChangeMode={() => {
              this.setState({ previewFullScreen: !this.state.previewFullScreen });
            }}
            isFullScreen={this.state.previewFullScreen}
          ></Preview>
          <EditPanel
            point={this.currentPoint}
            imageWidth={this.state.image != null ? this.state.image.width : 0}
            imageHeight={this.state.image != null ? this.state.image.height : 0}
            resizeMode={this.state.resizeMode}
            onAddPoint={() => {
              this.setState({
                isModalOpen: true,
              });
            }}
            onChange={(value) => {
              const pointCopy = this.state.pointList.slice();
              const xKeyCopy = this.state.xKeys.slice();
              const yKeyCopy = this.state.yKeys.slice();
              const newValue = value as EditPoint;
              pointCopy[this.state.selectIndex] = newValue;
              for (let i = 0; i < xKeyCopy.length; i++) {
                if (newValue.canvasWidth == xKeyCopy[i].key) {
                  xKeyCopy[i].contentLength = newValue.contentWidth;
                  xKeyCopy[i].scale = newValue.hScale;
                  if (this.isLinear) {
                    for (let j = 0; j < pointCopy.length; j++) {
                      if (newValue.canvasWidth == pointCopy[j].canvasWidth) {
                        pointCopy[j].contentWidth = newValue.contentWidth;
                        pointCopy[j].hScale = newValue.hScale;
                      }
                    }
                  }
                  break;
                }
              }
              for (let i = 0; i < yKeyCopy.length; i++) {
                if (newValue.canvasHeight == yKeyCopy[i].key) {
                  yKeyCopy[i].contentLength = newValue.contentHeight;
                  yKeyCopy[i].scale = newValue.vScale;
                  if (this.isLinear) {
                    for (let j = 0; j < pointCopy.length; j++) {
                      if (newValue.canvasHeight == pointCopy[j].canvasHeight) {
                        pointCopy[j].contentHeight = newValue.contentHeight;
                        pointCopy[j].vScale = newValue.vScale;
                      }
                    }
                  }
                  break;
                }
              }

              this.setState({
                pointList: pointCopy,
                yKeys: yKeyCopy,
                xKeys: xKeyCopy,
              });
            }}
            onMethodChange={(value) => {
              this.setState({
                resizeMode: value,
              })
            }}
            onLoadImage={(value, name) => {
              this.loadImage(value);
              const img = name.replace(/\.(png|svg|jpg|jpeg|gif|bmp|tiff)/, '') + '.rvg';
              this.setState({
                imageName: img,
              })
            }}
            onSaveFile={() => {
              this._resizer.saveFiles(this.isLinear, this.state.pointList, this._seamCarver, this.state.imageName);
            }}
            onLoadFile={(value) => {
              this.loadFile(value);
            }}
          ></EditPanel>
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
              let xKey: Key | null = null;
              let yKey: Key | null = null;
              for (const x of this.state.xKeys) {
                if (x.key == this.state.inputWidth) xKey = x;
              }
              for (const y of this.state.yKeys) {
                if (y.key == this.state.inputHeight) yKey = y;
              }
              if (this.isLinear) {
                const xKeyCopy = this.state.xKeys.slice();
                const yKeyCopy = this.state.yKeys.slice();
                if (xKey === null) {
                  xKey = {
                    key: this.state.inputWidth, origin: 0, scale: 1.0, contentLength: this.state.image.width,
                  };
                  xKeyCopy.push(xKey);
                }
                if (yKey == null) {
                  yKey = {
                    key: this.state.inputHeight, origin: 0, scale: 1.0, contentLength: this.state.image.height,
                  };
                  yKeyCopy.push(yKey);
                }
                const newPoint = new EditPoint(this.state.inputWidth, this.state.inputHeight, xKey.origin, yKey.origin, xKey.contentLength, yKey.contentLength, xKey.scale, yKey.scale);
                const pointCopy = this.state.pointList.slice();
                pointCopy.push(newPoint);
                this.setState({
                  pointList: pointCopy,
                  isModalOpen: false,
                  inputWidth: this.state.image.width,
                  inputHeight: this.state.image.height,
                  xKeys: xKeyCopy,
                  yKeys: yKeyCopy,
                });
              } else {
                const newPoint = new EditPoint(this.state.inputWidth, this.state.inputHeight, 0, 0, this.state.image.width, this.state.image.height);
                const xKeyCopy = this.state.xKeys.slice();
                const yKeyCopy = this.state.yKeys.slice();
                if (xKey === null) {
                  xKeyCopy.push({
                    key: this.state.inputWidth, origin: 0, scale: 1.0, contentLength: this.state.image.width,
                  });
                }
                if (yKey == null) {
                  yKeyCopy.push({
                    key: this.state.inputHeight, origin: 0, scale: 1.0, contentLength: this.state.image.height,
                  })
                }
                const pointCopy = this.state.pointList.slice();
                pointCopy.push(newPoint);
                this.setState({
                  pointList: pointCopy,
                  isModalOpen: false,
                  inputWidth: this.state.image.width,
                  inputHeight: this.state.image.height,
                  xKeys: xKeyCopy,
                  yKeys: yKeyCopy,
                });
              }
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

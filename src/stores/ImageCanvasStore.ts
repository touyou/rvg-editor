import { action, observable, IObservableArray, computed } from 'mobx';
import { MultiResizer } from '../lib/multi-resizer/MultiResizer';
import SeamCarver from 'src/lib/seams/SeamCarver';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as UUID from 'uuid/v4';

export class KeyFrameStore {
  public seamCarver: SeamCarver | null;
  @observable
  public _xKeyFrames: IObservableArray<KeyFrame> = observable([]);
  @observable
  public _yKeyFrames: IObservableArray<KeyFrame> = observable([]);

  private log: string = '';

  @computed
  get sortedXKeyFrames(): Array<KeyFrame> {
    let keyFrames = this._xKeyFrames.slice();
    keyFrames.sort((a, b) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });
    return keyFrames;
  }

  @computed
  get sortedYKeyFrames(): Array<KeyFrame> {
    let keyFrames = this._yKeyFrames.slice();
    keyFrames.sort((a, b) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });
    return keyFrames;
  }

  @computed
  get resizer(): MultiResizer | null {
    if (this.seamCarver) {
      const imageData = this.seamCarver.image;
      const verticalSeamMap = this.seamCarver.consistentVerticalMap;
      const horizontalSeamMap = this.seamCarver.consistentHorizontalMap;
      let originXKeys: number[][] = [];
      let originYKeys: number[][] = [];
      let widthKeys: number[][] = [];
      let heightKeys: number[][] = [];
      let scaleXKeys: number[][] = [];
      let scaleYKeys: number[][] = [];
      for (const keyFrame of this.sortedXKeyFrames) {
        originXKeys.push([keyFrame.value, keyFrame.originPosition]);
        widthKeys.push([keyFrame.value, keyFrame.seamLength]);
        scaleXKeys.push([keyFrame.value, keyFrame.scale]);
      }
      for (const keyFrame of this.sortedYKeyFrames) {
        originYKeys.push([keyFrame.value, keyFrame.originPosition]);
        heightKeys.push([keyFrame.value, keyFrame.seamLength]);
        scaleYKeys.push([keyFrame.value, keyFrame.scale]);
      }
      const metainfo = {
        originXKeys: originXKeys,
        originYKeys: originYKeys,
        widthKeys: widthKeys,
        heightKeys: heightKeys,
        scaleXKeys: scaleXKeys,
        scaleYKeys: scaleYKeys,
        verticalSeamMap: verticalSeamMap,
        horizontalSeamMap: horizontalSeamMap
      };
      return new MultiResizer(imageData, metainfo);
    }
    return null;
  }

  public addFrame(value: number, originalLength: number, seamLength: number, isHorizontal: boolean) {
    if (isHorizontal) {
      if (this._xKeyFrames.filter(key => { return key.value === value }).length === 0) {
        const newKey = new KeyFrame(value, originalLength, seamLength)
        this._xKeyFrames.push(newKey);
        this.log += 'add x key(' + newKey.id + '): ' + value.toString() + ';';
      }
    } else {
      if (this._yKeyFrames.filter(key => { return key.value === value }).length === 0) {
        const newKey = new KeyFrame(value, originalLength, seamLength)
        this._yKeyFrames.push(newKey);
        this.log += 'add y key(' + newKey.id + '): ' + value.toString() + ';';
      }
    }
  }

  public setSeamCarver(seamCarver: SeamCarver) {
    this.seamCarver = seamCarver;
  }

  public getXKey(id: string) {
    return this._xKeyFrames.filter(key => { return key.id === id })[0];
  }

  public getYKey(id: string) {
    return this._yKeyFrames.filter(key => { return key.id === id })[0];
  }

  public removeXKey(id: string) {
    this._xKeyFrames = observable(this._xKeyFrames.filter(key => { return key.id !== id }));
    this.log += 'add x key(' + id + ');';
  }

  public removeYKey(id: string) {
    this._yKeyFrames = observable(this._yKeyFrames.filter(key => { return key.id !== id }));
    this.log += 'add y key(' + id + ');';
  }

  public logging(str: string) {
    this.log += str;
  }

  public saveFiles(path: string) {
    if (this.seamCarver) {
      const imageData = this.seamCarver.image;
      const verticalSeamMap = this.seamCarver.consistentVerticalMap;
      const horizontalSeamMap = this.seamCarver.consistentHorizontalMap;
      let originXKeys: number[][] = [];
      let originYKeys: number[][] = [];
      let widthKeys: number[][] = [];
      let heightKeys: number[][] = [];
      let scaleXKeys: number[][] = [];
      let scaleYKeys: number[][] = [];
      for (const keyFrame of this.sortedXKeyFrames) {
        originXKeys.push([keyFrame.value, keyFrame.originPosition]);
        widthKeys.push([keyFrame.value, keyFrame.seamLength]);
        scaleXKeys.push([keyFrame.value, keyFrame.scale]);
      }
      for (const keyFrame of this.sortedYKeyFrames) {
        originYKeys.push([keyFrame.value, keyFrame.originPosition]);
        heightKeys.push([keyFrame.value, keyFrame.seamLength]);
        scaleYKeys.push([keyFrame.value, keyFrame.scale]);
      }
      const metainfo = {
        originXKeys: originXKeys,
        originYKeys: originYKeys,
        widthKeys: widthKeys,
        heightKeys: heightKeys,
        scaleXKeys: scaleXKeys,
        scaleYKeys: scaleYKeys,
        verticalSeamMap: verticalSeamMap,
        horizontalSeamMap: horizontalSeamMap
      };

      const jsonText = JSON.stringify(metainfo);
      const zip = new JSZip();
      zip.file('metainfo.json', jsonText);

      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(imageData, 0, 0);
      zip.file('image.png', canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
      // ctx.putImageData(this.seamCarver!.sobelImage, 0, 0);
      // zip.file('sobel.png', canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, path);
      });
    }
  }

  public sendFiles(path: string) {
    if (this.seamCarver) {
      const imageData = this.seamCarver.image;
      const verticalSeamMap = this.seamCarver.consistentVerticalMap;
      const horizontalSeamMap = this.seamCarver.consistentHorizontalMap;
      let originXKeys: number[][] = [];
      let originYKeys: number[][] = [];
      let widthKeys: number[][] = [];
      let heightKeys: number[][] = [];
      let scaleXKeys: number[][] = [];
      let scaleYKeys: number[][] = [];
      for (const keyFrame of this.sortedXKeyFrames) {
        originXKeys.push([keyFrame.value, keyFrame.originPosition]);
        widthKeys.push([keyFrame.value, keyFrame.seamLength]);
        scaleXKeys.push([keyFrame.value, keyFrame.scale]);
      }
      for (const keyFrame of this.sortedYKeyFrames) {
        originYKeys.push([keyFrame.value, keyFrame.originPosition]);
        heightKeys.push([keyFrame.value, keyFrame.seamLength]);
        scaleYKeys.push([keyFrame.value, keyFrame.scale]);
      }
      const metainfo = {
        originXKeys: originXKeys,
        originYKeys: originYKeys,
        widthKeys: widthKeys,
        heightKeys: heightKeys,
        scaleXKeys: scaleXKeys,
        scaleYKeys: scaleYKeys,
        verticalSeamMap: verticalSeamMap,
        horizontalSeamMap: horizontalSeamMap
      };

      const jsonText = JSON.stringify(metainfo);
      const zip = new JSZip();
      zip.file('metainfo.json', jsonText);
      zip.file('log.txt', this.log);

      let vHeatImage = new Uint8ClampedArray(imageData.width * imageData.height * 4);
      let hHeatImage = new Uint8ClampedArray(imageData.width * imageData.height * 4);
      for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
          const base = (y * imageData.width + x) * 4;
          const vColor = verticalSeamMap[y][x] / imageData.width * 255;
          vHeatImage[base] = vColor;
          vHeatImage[base + 1] = vColor;
          vHeatImage[base + 2] = vColor;
          vHeatImage[base + 3] = 255;
          const hColor = horizontalSeamMap[y][x] / imageData.height * 255;
          hHeatImage[base] = hColor;
          hHeatImage[base + 1] = hColor;
          hHeatImage[base + 2] = hColor;
          hHeatImage[base + 3] = 255;
        }
      }


      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(imageData, 0, 0);
      zip.file('image.png', canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });

      const vCanvas = document.createElement('canvas');
      vCanvas.width = imageData.width;
      vCanvas.height = imageData.height;
      const vctx = vCanvas.getContext('2d')!;
      vctx.putImageData(new ImageData(vHeatImage, imageData.width, imageData.height), 0, 0);
      zip.file('vimage.png', vCanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
      const hCanvas = document.createElement('canvas');
      hCanvas.width = imageData.width;
      hCanvas.height = imageData.height;
      const hctx = vCanvas.getContext('2d')!;
      hctx.putImageData(new ImageData(hHeatImage, imageData.width, imageData.height), 0, 0);
      zip.file('himage.png', vCanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });

      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, path);
      });
    }
  }

  @action.bound
  public deleteAll() {
    this._xKeyFrames.clear();
    this._yKeyFrames.clear();
    this.log += 'delete all';
  }
}

export class KeyFrame {
  /// id
  public id: string = '';
  /// Key Frame Value
  public value: number = 0;
  /// Original Image Length
  public originalLength: number = 0;
  /// Seam Carving Length
  @observable
  public seamLength: number = 0;
  /// Scale Value
  @observable
  public scale: number = 1;
  /// Origin Position
  @observable
  public originPosition: number = 0;

  get isOriginal(): boolean {
    return this.value === this.originalLength;
  }

  /**
   * Constructor of KeyFrame
   * @param value 
   * @param originalLength 
   * @param seamLength 
   */
  constructor(value: number, originalLength: number, seamLength: number) {
    this.id = UUID();
    this.value = value;
    this.originalLength = originalLength;
    this.seamLength = seamLength;
  }

  @action.bound
  public setOrigin(value: number) {
    this.originPosition = value;
  }

  @action.bound
  public setScale(value: number) {
    this.scale = value;
  }

  @action.bound
  public setSeamLength(value: number, ) {
    this.seamLength = value;
  }
}
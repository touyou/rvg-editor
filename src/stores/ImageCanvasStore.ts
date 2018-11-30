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
        this._xKeyFrames.push(new KeyFrame(value, originalLength, seamLength));
      }
    } else {
      if (this._yKeyFrames.filter(key => { return key.value === value }).length === 0) {
        this._yKeyFrames.push(new KeyFrame(value, originalLength, seamLength));
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
  }

  public removeYKey(id: string) {
    this._yKeyFrames = observable(this._yKeyFrames.filter(key => { return key.id !== id }));
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
      ctx.putImageData(this.seamCarver!.sobelImage, 0, 0);
      zip.file('sobel.png', canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
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

      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(imageData, 0, 0);
      zip.file('image.png', canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, path);
      });
    }
  }

  @action.bound
  public deleteAll() {
    this._xKeyFrames.clear();
    this._yKeyFrames.clear();
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
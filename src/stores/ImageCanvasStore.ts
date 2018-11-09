import { action, observable, IObservableArray } from 'mobx';
import Vec2 from '../lib/math/Vec2';
import { HomeStore } from './HomeStore';
import { MultiResizer } from '../lib/multi-resizer/MultiResizer';
import SeamCarver from 'src/lib/seams/SeamCarver';

export class ImagesStore {
  @observable
  public images: IObservableArray<ImageCanvasStore> = observable([]);

  public getResizer(seamCarver: SeamCarver) {
    const imageData = seamCarver.image;
    const seamMap = seamCarver.getSeamMap();
    let images = this.images.slice();
    images.sort((a, b) => { return a.canvasWidth < b.canvasWidth ? 1 : 0 });
    let originXKeys: number[][] = [];
    let originYKeys: number[][] = [];
    let widthKeys: number[][] = [];
    let heightKeys: number[][] = [];
    let scaleXKeys: number[][] = [];
    let scaleYKeys: number[][] = [];
    for (let image of images) {
      originXKeys.push([image.canvasWidth, image.originPoint.x]);
      widthKeys.push([image.canvasWidth, image.seamWidth]);
      scaleXKeys.push([image.canvasWidth, image.scale.x]);
    }
    images.sort((a, b) => { return a.canvasHeight < b.canvasHeight ? 1 : 0 });
    for (let image of images) {
      originYKeys.push([image.canvasHeight, image.originPoint.y]);
      heightKeys.push([image.canvasHeight, image.seamHeight]);
      scaleYKeys.push([image.canvasHeight, image.scale.y]);
    }
    const metainfo = {
      originXKeys: originXKeys,
      originYKeys: originYKeys,
      widthKeys: widthKeys,
      heightKeys: heightKeys,
      scaleXKeys: scaleXKeys,
      scaleYKeys: scaleYKeys,
      seamMap: seamMap
    };
    return new MultiResizer(imageData, metainfo);
  }

  @action.bound
  public addImage(image: ImageCanvasStore) {
    this.images.push(image);
  }

  @action.bound
  public deleteAll() {
    this.images.clear();
  }
}

export default class ImageCanvasStore {
  public id: string = '';
  @observable
  public canvasWidth: number = 0;
  @observable
  public canvasHeight: number = 0;
  @observable
  public originalWidth: number = 0;
  @observable
  public originalHeight: number = 0;
  @observable
  public seamWidth: number = 0;
  @observable
  public seamHeight: number = 0;
  @observable
  public startPoint: Vec2 = new Vec2(0, 0);
  @observable
  public diffPoint: Vec2 = new Vec2(0, 0);
  @observable
  public originPoint: Vec2 = new Vec2(0, 0);
  @observable
  public scale: Vec2 = new Vec2(1, 1);
  @observable
  public isRatioLocked: boolean = false;
  @observable
  public isDragging: boolean = false;

  constructor(public isSeamRemove: boolean, home: HomeStore, id: string) {
    this.canvasWidth = home.addWidth;
    this.originalWidth = home.originalImage!.naturalWidth;
    this.originalHeight = home.originalImage!.naturalHeight;
    this.seamWidth = isSeamRemove ? this.canvasWidth : this.originalWidth;
    this.canvasHeight = this.originalHeight;
    this.seamHeight = this.originalHeight;
    this.id = id;
  }

  public toggleRatioLocked() {
    this.isRatioLocked = !this.isRatioLocked;
  }

  public onMouseDownCanvas(point: Vec2) {
    this.isDragging = true;
    this.startPoint = point;
  }

  public onMouseMove(point: Vec2, completion: Function) {
    this.diffPoint = Vec2.add(Vec2.div(Vec2.sub(point, this.startPoint), this.scale), this.originPoint);
    completion();
  }

  public onMouseUp() {
    this.isDragging = false;
    this.originPoint = this.diffPoint;
  }

  public onChangeCanvasWidth(value: number, completion: Function) {
    this.canvasWidth = value;
    completion();
  }

  public onChangeCanvasHeight(value: number, completion: Function) {
    this.canvasHeight = value;
    completion();
  }

  public onChangeScaleX(value: number, completion: Function) {
    const diff = this.scale.x - value;
    const newScale = new Vec2(value, this.isRatioLocked ? this.scale.y - diff : this.scale.y);
    this.scale = newScale;
    completion(newScale);
  }

  public onChangeScaleY(value: number, completion: Function) {
    const diff = this.scale.y - value;
    const newScale = new Vec2(this.isRatioLocked ? this.scale.x - diff : this.scale.x, value);
    this.scale = newScale;
    completion();
  }

  public onChangeSeamWidth(value: number, completion: Function) {
    this.seamWidth = value;
    completion();
  }

  public onClickResetButton() {
    this.seamWidth = this.originalWidth;
    this.seamHeight = this.originalHeight;
    this.startPoint = new Vec2(0, 0);
    this.diffPoint = new Vec2(0, 0);
    this.originPoint = new Vec2(0, 0);
    this.scale = new Vec2(1, 1);
    this.isRatioLocked = false;
    this.isDragging = false;
  }
}
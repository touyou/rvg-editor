import { action, observable } from 'mobx';
import Vec2 from 'src/lib/math/Vec2';

export class ImagesStore {
  @observable
  public images: Array<ImageCanvasStore> = [];

  @action.bound
  public addImage(image: ImageCanvasStore) {
    this.images.push(image);
  }
}

export default class ImageCanvasStore {
  @observable
  public id: number = 0;
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

  @action.bound
  public toggleRatioLocked() {
    this.isRatioLocked = !this.isRatioLocked;
  }

  @action.bound
  public onMouseDownCanvas(point: Vec2) {
    this.isDragging = true;
    this.startPoint = point;
  }

  @action.bound
  public onMouseMove(point: Vec2) {
    this.diffPoint = Vec2.add(Vec2.div(Vec2.sub(point, this.startPoint), this.scale), this.originPoint);
  }

  @action.bound
  public onMouseUp(completion: Function) {
    this.isDragging = false;
    this.originPoint = this.diffPoint;
    completion();
  }

  @action.bound
  public onChangeCanvasWidth(value: number, completion: Function) {
    this.canvasWidth = value;
    completion();
  }

  @action.bound
  public onChangeCanvasHeight(value: number, completion: Function) {
    this.canvasHeight = value;
    completion();
  }

  @action.bound
  public onChangeScaleX(value: number, completion: Function) {
    const diff = this.scale.x - value;
    const newScale = new Vec2(value, this.isRatioLocked ? this.scale.y - diff : this.scale.y);
    this.scale = newScale;
    completion();
  }

  @action.bound
  public onChangeScaleY(value: number, completion: Function) {
    const diff = this.scale.y - value;
    const newScale = new Vec2(this.isRatioLocked ? this.scale.x - diff : this.scale.x, value);
    this.scale = newScale;
    completion();
  }


}
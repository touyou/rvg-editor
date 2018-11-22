import { observable } from 'mobx';
import { NumberSize } from 're-resizable';

export class PreviewStore {
  @observable
  public canvasWidth: number = 0;
  @observable
  public canvasHeight: number = 0;

  public drawImage: Function | null = null;

  public onChangeSize(delta: NumberSize, completion: Function) {
    this.canvasWidth += delta.width;
    this.canvasHeight += delta.height;
    completion();
  }

  public setSize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
}
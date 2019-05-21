export default class EditPoint {
  canvasWidth: number;
  canvasHeight: number;

  x: number;
  y: number;
  hScale: number;
  vScale: number;
  contentWidth: number;
  contentHeight: number;

  isShadow: boolean;

  constructor(canvasWidth: number, canvasHeight: number, x: number, y: number, contentWidth: number, contentHeight: number, hScale: number = 1.0, vScale: number = 1.0) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.x = x;
    this.y = y;
    this.hScale = hScale;
    this.vScale = vScale;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;
    this.isShadow = false;
  }

  clone(): EditPoint {
    let result = new EditPoint(this.canvasWidth, this.canvasHeight, this.x, this.y, this.contentWidth, this.contentHeight);
    result.hScale = this.hScale;
    result.vScale = this.vScale;
    return result;
  }

  convertObject() {
    return {
      width: this.canvasWidth,
      height: this.canvasHeight,
      originX: this.x,
      originY: this.y,
      hScale: this.hScale,
      vScale: this.vScale,
      contentWidth: this.contentWidth,
      contentHeight: this.contentHeight,
    };
  }
}

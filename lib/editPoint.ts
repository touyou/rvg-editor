export default class EditPoint {
  canvasWidth: number;
  canvasHeight: number;

  hScale: number;
  vScale: number;
  contentWidth: number;
  contentHeight: number;

  constructor(canvasWidth: number, canvasHeight: number, contentWidth: number, contentHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.hScale = 1.0;
    this.vScale = 1.0;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;
  }

  clone(): EditPoint {
    let result = new EditPoint(this.canvasWidth, this.canvasHeight, this.contentWidth, this.contentHeight);
    result.hScale = this.hScale;
    result.vScale = this.vScale;
    return result;
  }
}

import { RBF } from '../rbf';
import { BaseResizer } from './multiResizer';
import { NDArray } from '@bluemath/common';
import EditPoint from '../editPoint';

export class RbfResizer extends BaseResizer {
  /**
   * @class
   * @param {ImageData} image
   * @param {EditPoint[]} keyPoints
   */
  constructor(image, keyPoints) {
    super();
    this.rbf = new RBF();
    this.image = image;

    this.A = [];
    let originX = new Float32Array();
    let originY = new Float32Array();
    let hScale = new Float32Array();
    let vScale = new Float32Array();
    let contentWidth = new Float32Array();
    let contentHeight = new Float32Array();
    for (let keyPoint of keyPoints) {
      this.A.push(new NDArray([keyPoint.canvasWidth, keyPoint.canvasHeight]));
      originX.push(keyPoint.x);
      originY.push(keyPoint.y);
      hScale.push(keyPoint.hScale);
      vScale.push(keyPoint.vScale);
      contentWidth.push(keyPoint.contentWidth);
      contentHeight.push(keyPoint.contentHeight);
    }
    this.xWeight = this.rbf.computeWeights(new NDArray(originX), this.A);
    this.yWeight = this.rbf.computeWeights(new NDArray(originY), this.A);
    this.hScaleWeight = this.rbf.computeWeights(new NDArray(hScale), this.A);
    this.vScaleWeight = this.rbf.computeWeights(new NDArray(vScale), this.A);
    this.widthWeight = this.rbf.computeWeights(new NDArray(contentWidth), this.A);
    this.heightWeight = this.rbf.computeWeights(new NDArray(contentHeight), this.A);
  }

  seamImageData(width, height) {
    const point = new NDArray([width, height]);
    const contentWidth = this.rbf.interpolate(point, this.A, this.widthWeight);
    const contentHeight = this.rbf.interpolate(point, this.A, this.heightWeight);

  }

  originX(width, height) {
    return this.rbf.interpolate(new NDArray([width, height]), this.A, this.xWeight);
  }

  originY(width, height) {
    return this.rbf.interpolate(new NDArray([width, height]), this.A, this.yWeight);
  }

  hScale(width, height) {
    return this.rbf.interpolate(new NDArray([width, height]), this.A, this.hScaleWeight);
  }

  vScale(width, height) {
    return this.rbf.interpolate(new NDArray([width, height]), this.A, this.vScaleWeight);
  }
}

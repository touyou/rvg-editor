import { RBF } from '../rbf';
import { BaseResizer } from './multiResizer';
import { NDArray } from '@bluemath/common';
import EditPoint from '../editPoint';

export class RbfResizer extends BaseResizer {
  /**
   * @class
   * @param {ImageData} image
   * @param {EditPoint[]} keyPoints
   * @param {number[][]} horizontalSeamMap
   * @param {number[][]} verticalSeamMap
   */
  constructor(image, keyPoints, horizontalSeamMap, verticalSeamMap) {
    super();
    this.rbf = new RBF();
    this.image = image;
    this.consistentHorizontalMap = horizontalSeamMap;
    this.consistentVerticalMap = verticalSeamMap;

    this.A = [];
    this.originXArr = [];
    this.originYArr = [];
    this.hScaleArr = [];
    this.vScaleArr = [];
    this.contentWidthArr = [];
    this.contentHeightArr = [];
    for (const keyPoint of keyPoints) {
      this.A.push(new NDArray([keyPoint.canvasWidth, keyPoint.canvasHeight]));
      this.originXArr.push([keyPoint.x]);
      this.originYArr.push([keyPoint.y]);
      this.hScaleArr.push([keyPoint.hScale]);
      this.vScaleArr.push([keyPoint.vScale]);
      this.contentWidthArr.push([keyPoint.contentWidth]);
      this.contentHeightArr.push([keyPoint.contentHeight]);
    }
    this.xWeight = this.rbf.computeWeights(new NDArray(this.originXArr), this.A);
    this.yWeight = this.rbf.computeWeights(new NDArray(this.originYArr), this.A);
    this.hScaleWeight = this.rbf.computeWeights(new NDArray(this.hScaleArr), this.A);
    this.vScaleWeight = this.rbf.computeWeights(new NDArray(this.vScaleArr), this.A);
    this.widthWeight = this.rbf.computeWeights(new NDArray(this.contentWidthArr), this.A);
    this.heightWeight = this.rbf.computeWeights(new NDArray(this.contentHeightArr), this.A);
  }

  /**
   * Resize
   * @param {number} width
   * @param {number} height
   */
  seamImageData(width, height) {
    const point = new NDArray([width, height]);
    let contentWidth = Math.floor(this.rbf.interpolate(point, this.A, this.widthWeight));
    let contentHeight = Math.floor(this.rbf.interpolate(point, this.A, this.heightWeight));
    if (this.A.length == 1) {
      contentWidth = this.contentWidthArr[0];
      contentHeight = this.contentHeightArr[0];
    }
    if (contentWidth == 0 || contentHeight == 0) {
      console.log('failed interpolate: ' + contentWidth + ', ' + contentHeight);
      return this.image;
    }

    let horizontalMap = [];
    let image = this.image;
    let newImage = new Uint8ClampedArray(contentWidth * image.height * 4);
    let resizedImage = new Uint8ClampedArray(contentWidth * contentHeight * 4);
    if (image.width >= contentWidth) {
      const widthDiff = image.width - contentWidth;
      for (let y = 0; y < image.height; y++) {
        horizontalMap[y] = [];
        let x0 = 0;
        for (let x = 0; x < image.width; x++) {
          horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
          const base0 = (y * contentWidth + x0) * 4;
          const base = (y * image.width + x) * 4;
          newImage[base0] = image.data[base];
          newImage[base0 + 1] = image.data[base + 1];
          newImage[base0 + 2] = image.data[base + 2];
          newImage[base0 + 3] = image.data[base + 3];
          if (this.consistentVerticalMap[y][x] > widthDiff) {
            x0 += 1;
          }
        }
      }
    } else {
      const widthDiff = contentWidth - image.width;
      for (let y = 0; y < image.height; y++) {
        horizontalMap[y] = [];
        let x0 = 0;
        for (let x = 0; x < image.width; x++) {
          const base = (y * image.width + x) * 4;
          if (this.consistentVerticalMap[y][x] <= widthDiff) {
            horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
            const base0 = (y * contentWidth + x0) * 4;
            newImage[base0] = image.data[base];
            newImage[base0 + 1] = image.data[base + 1];
            newImage[base0 + 2] = image.data[base + 2];
            newImage[base0 + 3] = image.data[base + 3];
            x0 += 1;
          }
          horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
          const base0 = (y * contentWidth + x0) * 4;
          newImage[base0] = image.data[base];
          newImage[base0 + 1] = image.data[base + 1];
          newImage[base0 + 2] = image.data[base + 2];
          newImage[base0 + 3] = image.data[base + 3];
          x0 += 1;
        }
      }
    }

    if (image.height >= contentHeight) {
      const heightDiff = image.height - contentHeight;
      for (let x = 0; x < contentWidth; x++) {
        let y0 = 0;
        for (let y = 0; y < image.height; y++) {
          const base0 = (y0 * contentWidth + x) * 4;
          const base = (y * contentWidth + x) * 4;
          resizedImage[base0] = newImage[base];
          resizedImage[base0 + 1] = newImage[base + 1];
          resizedImage[base0 + 2] = newImage[base + 2];
          resizedImage[base0 + 3] = newImage[base + 3];
          if (horizontalMap[y][x] > heightDiff) {
            y0 += 1;
          }
        }
      }
    } else {
      const heightDiff = contentHeight - image.height;
      for (let x = 0; x < contentWidth; x++) {
        let y0 = 0;
        for (let y = 0; y < image.height; y++) {
          const base = (y * contentWidth + x) * 4;
          if (horizontalMap[y][x] <= heightDiff) {
            const base0 = (y0 * contentWidth + x) * 4;
            resizedImage[base0] = newImage[base];
            resizedImage[base0 + 1] = newImage[base + 1];
            resizedImage[base0 + 2] = newImage[base + 2];
            resizedImage[base0 + 3] = newImage[base + 3];
            y0 += 1;
          }
          const base0 = (y0 * contentWidth + x) * 4;
          resizedImage[base0] = newImage[base];
          resizedImage[base0 + 1] = newImage[base + 1];
          resizedImage[base0 + 2] = newImage[base + 2];
          resizedImage[base0 + 3] = newImage[base + 3];
          y0 += 1;
        }
      }
    }

    return new ImageData(resizedImage, contentWidth, contentHeight);
  }

  originX(width, height) {
    if (this.A.length == 1) {
      return this.originXArr[0];
    }
    return this.rbf.interpolate(new NDArray([width, height]), this.A, this.xWeight);
  }

  originY(width, height) {
    if (this.A.length == 1) {
      return this.originYArr[0];
    }
    return this.rbf.interpolate(new NDArray([width, height]), this.A, this.yWeight);
  }

  hScale(width, height) {
    if (this.A.length == 1) {
      return this.hScaleArr[0];
    }
    return this.rbf.interpolate(new NDArray([width, height]), this.A, this.hScaleWeight);
  }

  vScale(width, height) {
    if (this.A.length == 1) {
      return this.vScaleArr[0];
    }
    return this.rbf.interpolate(new NDArray([width, height]), this.A, this.vScaleWeight);
  }
}

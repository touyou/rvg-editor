class Vec2 {
  constructor(x, y) {}

  get width() {
    return this.x;
  }
  get height() {
    return this.y;
  }

  static add(v1, v2) {
    return new Vec2(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1, v2) {
    return new Vec2(v1.x - v2.x, v1.y - v2.y);
  }

  static mul(v1, v2) {
    return new Vec2(v1.x * v2.x, v1.y * v2.y);
  }

  static div(v1, v2) {
    return new Vec2(v1.x / v2.x, v1.y / v2.y);
  }
}

export class MultiResizer {
  /**
   * Multi Resizer by original image info
   * @param {ImageData} image 
   * @param {Object} metainfo 
   */
  constructor(image, metainfo) {
    this.image = image;
    /**
     * metainfo.origins Array<Vec2>
     * metainfo.widthKeys Array<number>
     * metainfo.heightKeys Array<number>
     * metainfo.seamMap Array<Array<number>>
     */
    this.metainfo = metainfo;
    this.consistentHorizontalMap = metainfo.horizontalSeamMap;
    this.consistentVerticalMap = metainfo.verticalSeamMap;
  }

  /**
   * Resize
   * @param {number} width
   * @param {number} height
   */
  seamImageData(width, height) {
    const seamFactHorizontal = Math.floor(this.binarySearch(width, this.metainfo.widthKeys));
    const seamFactVertical = Math.floor(this.binarySearch(height, this.metainfo.heightKeys));

    let horizontalMap = [];
    let image = this.image;
    let newImage = new Uint8ClampedArray(seamFactHorizontal * image.height * 4);
    let resizedImage = new Uint8ClampedArray(seamFactHorizontal * seamFactVertical * 4);
    // First compute vertical
    if (image.width >= seamFactHorizontal) {
      const widthDiff = image.width - seamFactHorizontal;
      for (let y = 0; y < image.height; y++) {
        horizontalMap[y] = [];
        let x0 = 0;
        for (let x = 0; x < image.width; x++) {
          horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
          const base0 = (y * seamFactHorizontal + x0) * 4;
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
      const widthDiff = seamFactHorizontal - image.width;
      for (let y = 0; y < image.height; y++) {
        horizontalMap[y] = [];
        let x0 = 0;
        for (let x = 0; x < image.width; x++) {
          const base = (y * image.width + x) * 4;
          if (this.consistentVerticalMap[y][x] <= widthDiff) {
            horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
            const base0 = (y * seamFactHorizontal + x0) * 4;
            newImage[base0] = image.data[base];
            newImage[base0 + 1] = image.data[base + 1];
            newImage[base0 + 2] = image.data[base + 2];
            newImage[base0 + 3] = image.data[base + 3];
            x0 += 1;
          }
          horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
          const base0 = (y * seamFactHorizontal + x0) * 4;
          newImage[base0] = image.data[base];
          newImage[base0 + 1] = image.data[base + 1];
          newImage[base0 + 2] = image.data[base + 2];
          newImage[base0 + 3] = image.data[base + 3];
          x0 += 1;
        }
      }
    }
    // Second
    if (image.height >= seamFactVertical) {
      const heightDiff = image.height - seamFactVertical;
      for (let x = 0; x < seamFactHorizontal; x++) {
        let y0 = 0;
        for (let y = 0; y < image.height; y++) {
          const base0 = (y0 * seamFactHorizontal + x) * 4;
          const base = (y * seamFactHorizontal + x) * 4;
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
      const heightDiff = seamFactVertical - image.height;
      for (let x = 0; x < seamFactHorizontal; x++) {
        let y0 = 0;
        for (let y = 0; y < image.height; y++) {
          const base = (y * seamFactHorizontal + x) * 4;
          if (horizontalMap[y][x] <= heightDiff) {
            const base0 = (y0 * seamFactHorizontal + x) * 4;
            resizedImage[base0] = newImage[base];
            resizedImage[base0 + 1] = newImage[base + 1];
            resizedImage[base0 + 2] = newImage[base + 2];
            resizedImage[base0 + 3] = newImage[base + 3];
            y0 += 1;
          }
          const base0 = (y0 * seamFactHorizontal + x) * 4;
          resizedImage[base0] = newImage[base];
          resizedImage[base0 + 1] = newImage[base + 1];
          resizedImage[base0 + 2] = newImage[base + 2];
          resizedImage[base0 + 3] = newImage[base + 3];
          y0 += 1;
        }
      }
    }
    return new ImageData(resizedImage, seamFactHorizontal, seamFactVertical);
  }

  originX(width) {
    return this.binarySearch(width, this.metainfo.originXKeys);
  }

  originY(height) {
    return this.binarySearch(height, this.metainfo.originYKeys);
  }

  scaleX(width) {
    return this.binarySearch(width, this.metainfo.scaleXKeys);
  }

  scaleY(height) {
    return this.binarySearch(height, this.metainfo.scaleYKeys);
  }

  /**
   * @param {number} value
   * @param {any[][]} keyFrames
   */
  binarySearch(value, keyFrames) {
    let left = -1;
    let right = keyFrames.length;
    while (right - left > 1) {
      const mid = Math.floor((left + right) / 2);
      if (keyFrames[mid][0] >= value) {
        right = mid;
      } else {
        left = mid;
      }
    }

    if (keyFrames.length === 1) {
      return keyFrames[0][1];
    } else if (right === keyFrames.length) {
      const source = keyFrames[right - 2][1];
      const target = keyFrames[right - 1][1];
      const ts = keyFrames[right - 1][0] - keyFrames[right - 2][0];
      const vt = value - keyFrames[right - 1][0];
      if (ts === 0) {
        return target;
      }
      return target + (target - source) / ts * vt;
    } else if (keyFrames[right][0] === value) {
      return keyFrames[right][1];
    } else if (right === 0) {
      const source = keyFrames[right + 1][1];
      const target = keyFrames[right][1];
      const ts = keyFrames[right][0] - keyFrames[right + 1][0];
      const vt = value - keyFrames[right][0];
      if (ts === 0) {
        return target;
      }
      return target + (target - source) / ts * vt;
    } else {
      const lVal = keyFrames[right - 1][1];
      const rVal = keyFrames[right][1];
      const lr = keyFrames[right][0] - keyFrames[right - 1][0];
      const lv = keyFrames[right][0] - value;
      if (lr === 0) {
        return lVal;
      }
      return lVal + (rVal - lVal) / lr * lv;
    }
  }
}
import {
  Vec2
} from "../math/Vec2";

class MultiResizer {
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
  }

  /**
   * Resize
   * @param {number} width
   * @param {number} height
   */
  seamImageData = (width, height) => {
    const newImage = new ImageData(width, height);

    const seamFactHorizontal = this.binarySearch(width, this.metainfo.widthKeys);
    const seamFactVertical = this.binarySearch(height, this.metainfo.heightKeys);



    // for (let y = 0; y < this.image.height; y++) {
    //   let x0 = 0;
    //   for (let x = 0; x < this.image.width; x++) {
    //     if (this.metainfo.seamMap[y][x] > this.image.width - width ||
    //       this.metainfo.seamMap[y][x] == 0) {
    //       newImage.data[y][x0] = this.image.data[y][x];
    //       x0++;
    //     }
    //   }
    // }
  }

  originX = (width) => {
    return this.binarySearch(width, this.metainfo.originXKeys);
  }

  originY = (height) => {
    return this.binarySearch(height, this.metainfo.originYKeys);
  }

  scaleX = (width) => {
    return this.binarySearch(width, this.metainfo.scaleXKeys);
  }

  scaleY = (height) => {
    return this.binarySearch(height, this.metainfo.scaleYKeys);
  }

  /**
   * @param {number} value
   * @param {any[][]} keyFrames
   */
  binarySearch = (value, keyFrames) => {
    let left = 0;
    let right = keyFrames.length - 1;
    while (right - left > 0) {
      const mid = Math.floor((left + right) / 2);
      if (keyFrames[mid][0] < value) {
        left = mid;
      } else {
        right = mid;
      }
    }
    if (keyFrames[left][0] === value || keyFrames.length === 1) {
      return keyFrames[left][1];
    } else if (left === keyFrames.length - 1) {
      const source = keyFrames[left - 1][1];
      const target = keyFrames[left][1];
      const ts = keyFrames[left][0] - keyFrames[left - 1][0];
      const vt = value - keyFrames[left][0];
      return target + (target - source) / ts * vt;
    } else if (left === 0) {
      const source = keyFrames[left + 1][1];
      const target = keyFrames[left][1];
      const ts = keyFrames[left][0] - keyFrames[left + 1][0];
      const vt = value - keyFrames[left][0];
      return target + (target - source) / ts * vt;
    } else if (keyFrames[left][0] < value) {
      const lVal = keyFrames[left][1];
      const rVal = keyFrames[left + 1][1];
      const lr = keyFrames[left + 1][0] - keyFrames[left][0];
      const lv = value - keyFrames[left][0];
      return lVal + (rVal - lVal) / lr * lv;
    } else {
      const lVal = keyFrames[left - 1][1];
      const rVal = keyFrames[left][1];
      const lr = keyFrames[left][0] - keyFrames[left - 1][0];
      const lv = keyFrames[left][0] - value;
      return lVal + (rVal - lVal) / lr * lv;
    }
  }
}
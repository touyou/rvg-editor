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
  resize = (width, height) => {
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

  /**
   * @param {number} value
   * @param {number[][]} keyFrames
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
    return 0;
  }
}
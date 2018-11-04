/**
 * Seam Carving Impelementation
 * /// <reference path="http://nparashuram.com/seamcarving/"/>
 */

import Color from '../Color';

export default class SeamCarver {
  private newImage: Uint8ClampedArray;
  private heatMap: Float32Array[];
  // private maxHeat: number;
  private seams: number[][];
  private hSeams: number[][];

  /**
   * constructor
   * @param {ImageData} image
   */
  constructor(public image: ImageData) {
    console.log('Seam Carver Initialized');
    this.newImage = new Uint8ClampedArray(image.width * image.height * 4);
    this.initHeatMap();
    this.initSeam();
  }

  public copyImage = () => {
    for (let x = 0; x < this.image.width; x++) {
      for (let y = 0; y < this.image.height; y++) {
        this.putPixel(x, y, this.getPixel(x, y));
      }
    }
  }

  public resize = (width: number, height: number): ImageData => {
    let image = this.image;
    if (image.width >= width) {
      const widthDiff = image.width - width;
      this.newImage = new Uint8ClampedArray(image.width * image.height * 4);
      for (let y = 0; y < image.height; y++) {
        let x1 = 0;
        for (let x = 0; x < image.width; x++) {
          this.putPixel(x, y, this.getPixel(x, y));
          let isSkippable = false;
          for (let i = 0; i < widthDiff; i++) {
            if (this.seams[i][y] === x) {
              isSkippable = true;
              break;
            }
          }
          if (!isSkippable) {
            this.putPixel(x1, y, this.getPixel(x, y));
            x1++;
          }
        }
      }
      for (let x = width; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
          this.putPixel(x, y, 0xFFFFFF);
        }
      }
      return new ImageData(this.newImage!, image.width, image.height);
    } else {
      let widthDiff = width - image.width;
      if (widthDiff > this.seams.length) {
        widthDiff = this.seams.length;
      }
      this.newImage = new Uint8ClampedArray(width * image.height * 4);
      for (let y = 0; y < image.height; y++) {
        let x1 = 0;
        for (let x = 0; x < image.width; x++) {
          this.putPixel(x1, y, this.getPixel(x, y), width);
          let isDuplicatable = false;
          for (let i = 0; i < widthDiff; i++) {
            if (this.seams[i][y] === x) {
              isDuplicatable = true;
              break;
            }
          }
          if (isDuplicatable) {
            x1++;
            this.putPixel(x1, y, this.getPixel(x, y), width);
          }
          x1++;
        }
      }
      return new ImageData(this.newImage!, width, image.height);
    }
    // if (image.width >= width && image.height >= height) {
    //   const widthDiff = image.width - width;
    //   const heightDiff = image.height - height;
    //   this.newImage = new Uint8ClampedArray(image.width * image.height * 4);
    //   let y1 = 0;
    //   for (let y = 0; y < image.height; y++) {
    //     let x1 = 0;
    //     for (let x = 0; x < image.width; x++) {
    //       this.putPixel(x, y, this.getPixel(x, y));
    //       let isSkippable = false;
    //       for (let i = 0; i < widthDiff; i++) {
    //         if (this.seams[i][y] === x) {
    //           isSkippable = true;
    //           break;
    //         }
    //       }
    //       for (let i = 0; i < heightDiff; i++) {
    //         if (this.hSeams[i][x] === y) {
    //           isSkippable = true;
    //           break;
    //         }
    //       }
    //       if (!isSkippable) {
    //         this.putPixel(x1, y1, this.getPixel(x, y));
    //         x1++;
    //         y1++;
    //       }
    //     }
    //   }
    //   for (let x = width; x < image.width; x++) {
    //     for (let y = height; y < image.height; y++) {
    //       this.putPixel(x, y, 0xFFFFFF);
    //     }
    //   }

    //   return new ImageData(this.newImage!, image.width, image.height);
    // } else if (image.width < width && image.height < height) {
    //   let widthDiff = width - image.width;
    //   let heightDiff = height - image.height;
    //   if (widthDiff > this.seams.length) {
    //     widthDiff = this.seams.length;
    //   }
    //   if (heightDiff > this.hSeams.length) {
    //     heightDiff = this.hSeams.length;
    //   }
    //   this.newImage = new Uint8ClampedArray(width * height * 4);
    //   let y1 = 0;
    //   for (let y = 0; y < image.height; y++) {
    //     let x1 = 0;
    //     for (let x = 0; x < image.width; x++) {
    //       this.putPixel(x1, y1, this.getPixel(x, y), width);
    //       let isDuplicatable = false;
    //       for (let i = 0; i < widthDiff; i++) {
    //         if (this.seams[i][y] === x) {
    //           isDuplicatable = true;
    //           break;
    //         }
    //       }
    //       for (let i = 0; i < heightDiff; i++) {
    //         if (this.hSeams[i][x] === y) {
    //           isDuplicatable = true;
    //           break;
    //         }
    //       }
    //       if (isDuplicatable) {
    //         x1++;
    //         y1++;
    //         this.putPixel(x1, y1, this.getPixel(x, y), width);
    //       }
    //       x1++;
    //       y1++;
    //     }
    //   }
    //   return new ImageData(this.newImage!, width, height);
    // } else if (image.width >= width && image.height < height) {
    //   const widthDiff = image.width - width;
    //   let heightDiff = height - image.height;
    //   if (heightDiff > this.hSeams.length) {
    //     heightDiff = this.hSeams.length;
    //   }
    //   this.newImage = new Uint8ClampedArray(image.width * height * 4);
    //   let y1 = 0;
    //   for (let y = 0; y < image.height; y++) {
    //     let x1 = 0;
    //     for (let x = 0; x < image.height; x++) {
    //       this.putPixel(x, y1, this.getPixel(x, y));
    //       let isSkippable = false;
    //       let isDuplicatable = false;
    //       for (let i = 0; i < widthDiff; i++) {
    //         if (this.seams[i][y] === x) {
    //           isSkippable = true;
    //           break;
    //         }
    //       }
    //       for (let i = 0; i < heightDiff; i++) {
    //         if (this.hSeams[i][x] === y) {
    //           isDuplicatable = true;
    //           break;
    //         }
    //       }
    //       if (!isSkippable && isDuplicatable) {
    //         y1++;
    //         this.putPixel(x1, y1, this.getPixel(x, y));
    //         x1++;
    //         y1++;
    //       }
    //     }
    //   }
    // }
    // return new ImageData(width, height);
  }

  /**
   * get individual pixel
   * @param {number} x
   * @param {number} y
   */
  private getPixel = (x: number, y: number): Color => {
    const base = (y * this.image.width + x) * 4;
    return new Color(
      this.image.data[base + 0],
      this.image.data[base + 1],
      this.image.data[base + 2],
      this.image.data[base + 3],
    );
  }
  private putPixel = (x: number, y: number, color: Color | number, newWidth?: number) => {
    let rgba = color;
    if (typeof color === 'number') {
      rgba = new Color(
        (color & 0xFF0000) >> 16,
        (color & 0x00FF00) >> 8,
        (color & 0x0000FF),
        255,
      );
    }

    // console.log(rgba);
    if (newWidth !== undefined) {
      const base = (y * newWidth! + x) * 4;
      this.newImage![base + 0] = (rgba as Color).red;
      this.newImage![base + 1] = (rgba as Color).green;
      this.newImage![base + 2] = (rgba as Color).blue;
      this.newImage![base + 3] = (rgba as Color).alpha;
    } else {
      const base = (y * this.image.width + x) * 4;
      this.newImage![base + 0] = (rgba as Color).red;
      this.newImage![base + 1] = (rgba as Color).green;
      this.newImage![base + 2] = (rgba as Color).blue;
      this.newImage![base + 3] = (rgba as Color).alpha;
    }
  }

  private initHeatMap = () => {
    console.time('calculate heatmap');
    const b = (x: number, y: number): number => {
      if (x < 0 || y < 0 || x >= this.image.width || y >= this.image.height) {
        return 0;
      }
      const pixel = this.getPixel(x, y);
      return pixel.red + pixel.green + pixel.blue;
    };
    const heatMap = new Array<Float32Array>();
    let max = 0;
    for (let x = 0; x < this.image.width; x++) {
      heatMap[x] = new Float32Array(this.image.height);
      for (let y = 0; y < this.image.height; y++) {
        const xenergy = b(x - 1, y - 1) + 2 * b(x - 1, y) + b(x - 1, y + 1) - b(x + 1, y - 1) - 2 * b(x + 1, y) - b(x + 1, y + 1);
        const yenergy = b(x - 1, y - 1) + 2 * b(x, y - 1) + b(x + 1, y - 1) - b(x - 1, y + 1) - 2 * b(x, y + 1) - b(x + 1, y + 1);
        heatMap[x][y] = Math.sqrt(xenergy * xenergy + yenergy * yenergy);
        max = (max > heatMap[x][y] ? max : heatMap[x][y]);
      }
    }
    console.timeEnd('calculate heatmap');

    this.heatMap = heatMap;
    // this.maxHeat = max;
  }

  private initSeam = () => {
    console.time('seams calculate')
    const yseam: number[][] = [];
    const xseam: number[][] = [];
    const ylen = this.image.height - 1;
    const xlen = this.image.width - 1;
    let yHeat = this.heatMap;
    // initialize the last row of the seam
    for (let x = 0; x < this.image.width; x++) {
      yseam[x] = [];
      yseam[x][ylen] = x;
    }

    // sort the last row of the seam
    for (let i = 0; i < yseam.length; i++) {
      for (let j = i + 1; j < yseam.length; j++) {
        if (this.heatMap[yseam[i][ylen]][ylen] > this.heatMap[yseam[j][ylen]][ylen]) {
          const tmp = yseam[j];
          yseam[j] = yseam[i];
          yseam[i] = tmp;
        }
      }
    }

    // get the other rows of the seam
    for (const yline of yseam) {
      for (let y = ylen - 1; y >= 0; y--) {
        const x1 = yline[y + 1];
        let x0 = x1 - 1;
        // Move along till the adjacent pixel is not a part of another seam
        while (x0 >= 0) {
          if (!isNaN(yHeat[x0][y])) {
            break;
          }
          x0--;
        }

        let x2 = x1 + 1;
        while (x2 < this.image.width) {
          if (!isNaN(yHeat[x2][y])) {
            break;
          }
          x2++;
        }

        const hx0 = this.heatMap[x0] ? this.heatMap[x0][y] : Number.MAX_VALUE;
        const hx1 = this.heatMap[x1][y] || Number.MAX_VALUE;
        const hx2 = this.heatMap[x2] ? this.heatMap[x2][y] : Number.MAX_VALUE;

        yline[y] = hx0 < hx1 ? (hx0 < hx2 ? x0 : x2) : (hx1 < hx2 ? x1 : x2);
        yHeat[yline[y]][y] = NaN;
      }
    }

    for (let y = 0; y < this.image.height; y++) {
      xseam[y] = [];
      xseam[y][xlen] = y;
    }

    for (let i = 0; i < xseam.length; i++) {
      for (let j = 0; j < xseam.length; j++) {
        if (this.heatMap[xlen][xseam[i][xlen]] > this.heatMap[xlen][xseam[j][xlen]]) {
          const tmp = xseam[j];
          xseam[j] = xseam[i];
          xseam[i] = tmp;
        }
      }
    }

    for (const xline of xseam) {
      for (let x = xlen - 1; x >= 0; x--) {
        const y1 = xline[x + 1];
        let y0 = y1 - 1;
        while (y0 >= 0) {
          if (!isNaN(this.heatMap[x][y0])) {
            break;
          }
          y0--;
        }
        let y2 = y1 + 1;
        while (y2 < this.image.height) {
          if (!isNaN(this.heatMap[x][y2])) {
            break;
          }
          y2++;
        }

        const hy0 = y0 >= 0 ? this.heatMap[x][y0] : Number.MAX_VALUE;
        const hy1 = this.heatMap[x][y1] || Number.MAX_VALUE;
        const hy2 = y2 < this.image.height ? this.heatMap[x][y2] : Number.MAX_VALUE;

        xline[x] = hy0 < hy1 ? (hy0 < hy2 ? y0 : y2) : (hy1 < hy2 ? y1 : y2);
        this.heatMap[x][xline[x]] = NaN;
      }
    }

    console.timeEnd('seams calculate');
    this.seams = yseam;
    this.hSeams = xseam;
    console.log(this.hSeams[0]);
  }
}

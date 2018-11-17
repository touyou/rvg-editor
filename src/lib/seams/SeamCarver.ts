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
  private seamMap: number[][];

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

  public getSeamMap = () => {
    if (this.seamMap) {
      return this.seamMap
    }
    this.seamMap = [];
    for (let y = 0; y < this.image.height; y++) {
      this.seamMap[y] = [];
      for (let x = 0; x < this.image.width; x++) {
        this.seamMap[y][x] = 0;
        for (let i = 0; i < this.seams.length; i++) {
          if (this.seams[i][y] === x) {
            this.seamMap[y][x] = i + 1;
          }
        }
      }
    }
    return this.seamMap;
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

export class SeamCarverTemp {
  _seamEnergy: number;
  imageData: ImageDataWrapper;
  consistentVerticalMap: number[][];
  consistentHorizontalMap: number[][];

  constructor(public image: ImageData) {
    this.imageData = new ImageDataWrapper(image);
  }

  constructConsistentMap() {
    const heatMap = this.sobelEnergy(this.imageData);
    const width = this.imageData.width;
    const height = this.imageData.height;
    const inf = Number.MAX_VALUE;
    const minRow = (value: number[][], y: number, x: number, length: number) => {
      const vl = x - 1 >= 0 ? value[y][x - 1] : inf;
      const vm = value[y][x];
      const vr = x + 1 < length ? value[y][x + 1] : inf;
      return vl < vm ? (vl < vr ? vl : vr) : (vm < vr ? vm : vr);
    }
    const minCol = (value: number[][], y: number, x: number, length: number) => {
      const vl = y - 1 >= 0 ? value[y - 1][x] : inf;
      const vm = value[y][x];
      const vr = y + 1 < length ? value[y + 1][x] : inf;
      return vl < vm ? (vl < vr ? vl : vr) : (vm < vr ? vm : vr);
    }

    // First compute best 1-edge path for all pairs of rows
    let pairList: number[][] = [];
    for (let y = 0; y < height - 1; y += 1) {
      pairList[y] = [];

      /// Hungarian algorithm
      /// -------------------
      let hungaryMap: number[][] = [];
      for (let i = 0; i < width; i += 1) {
        pairList[y][i] = 0;
        hungaryMap[i] = [];
        for (let j = 0; j < width; j += 1) {
          hungaryMap[i][j] = Math.abs(i - j) <= 1 ? heatMap[y][i] + heatMap[y + 1][j] : inf;
        }
      }

      // step1
      for (let i = 0; i < width; i += 1) {
        const minVal = minRow(hungaryMap, i, i, width);
        for (let j = Math.max(0, i - 1); j < Math.min(i + 1, width); j += 1) {
          hungaryMap[i][j] -= minVal;
        }
      }
      for (let i = 0; i < width; i += 1) {
        const minVal = minCol(hungaryMap, i, i, width);
        for (let j = Math.max(0, i - 1); j < Math.min(i + 1, width); j += 1) {
          hungaryMap[j][i] -= minVal;
        }
      }

      console.time('hungarian');
      while (true) {
        // step2
        let zeroCoordinate: number[][] = [];
        for (let i = 0; i < width; i += 1) {
          for (let j = Math.max(0, i - 1); j < Math.min(i + 1, width); j += 1) {
            if (hungaryMap[i][j] === 0) {
              zeroCoordinate.push([i, j]);
            }
          }
        }
        let checkRow: number[] = [];
        let checkCol: number[] = [];
        for (const elem of zeroCoordinate) {
          let flag = false;
          for (let i = 0, len = checkRow.length; i < len; i++) {
            if (checkRow[i] === elem[0]) {
              flag = true;
              break;
            }
          }
          for (let i = 0, len = checkCol.length; !flag && i < len; i++) {
            if (checkCol[i] === elem[1]) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            checkRow.push(elem[0]);
            checkCol.push(elem[1]);
          }
        }
        if (checkRow.length === width) {
          for (let i = 0, len = checkRow.length; i < len; i++) {
            pairList[y][checkRow[i]] = checkCol[i];
          }
          break;
        }

        // step3
        let rowCount: number[] = new Array<number>(width);
        let colCount: number[] = new Array<number>(width);
        let lineR: number[] = [];
        let lineC: number[] = [];
        while (zeroCoordinate.length > 0) {
          let maxZero = 0;
          let mode = 0;
          let ind = 0;
          for (const elem of zeroCoordinate) {
            if (rowCount[elem[0]]) {
              rowCount[elem[0]] += 1;
            } else {
              rowCount[elem[0]] = 1;
            }
            if (colCount[elem[1]]) {
              colCount[elem[1]] += 1;
            } else {
              colCount[elem[1]] = 1;
            }
            if (maxZero < rowCount[elem[0]]) {
              maxZero = rowCount[elem[0]];
              mode = 0;
              ind = elem[0];
            }
            if (maxZero < colCount[elem[1]]) {
              maxZero = colCount[elem[1]];
              mode = 1;
              ind = elem[1];
            }
          }
          if (mode === 0) {
            lineR.push(ind);
            zeroCoordinate = zeroCoordinate.filter((value: number[]) => {
              return value[0] !== ind;
            });
          } else {
            lineC.push(ind);
            zeroCoordinate = zeroCoordinate.filter((value: number[]) => {
              return value[1] !== ind;
            });
          }
          rowCount = new Array<number>(width);
          colCount = new Array<number>(width);
        }

        // step4
        let minVal = Number.MAX_VALUE;
        for (let i = 0; i < width; i += 1) {
          let flag = false;
          for (let k = 0, len = lineR.length; k < len; k += 1) {
            if (lineR[k] === i) {
              flag = true;
              break;
            }
          }
          if (flag) {
            continue;
          }
          for (let j = Math.max(0, i - 1); j < Math.min(i + 1, width); j += 1) {
            for (let k = 0, len = lineC.length; k < len; k += 1) {
              if (lineC[k] === j) {
                flag = true;
                break;
              }
            }
            if (flag) {
              flag = false;
              continue;
            }
            if (minVal > hungaryMap[i][j]) {
              minVal = hungaryMap[i][j];
            }
          }
        }
        for (let i = 0; i < width; i += 1) {
          let flagR = false;
          for (let k = 0, len = lineR.length; k < len; k += 1) {
            if (lineR[k] === i) {
              flagR = true;
              break;
            }
          }
          for (let j = Math.max(0, i - 1); j < Math.min(i + 1, width); j += 1) {
            let flagC = false;
            for (let k = 0, len = lineC.length; k < len; k += 1) {
              if (lineC[k] === j && flagR) {
                hungaryMap[i][j] += minVal;
                flagC = true;
                break;
              }
            }
            if (!flagC && !flagR) {
              hungaryMap[i][j] -= minVal;
            }
          }
        }
      }
      console.timeEnd('hungarian');
    }

    // pairList is 1-edge information
    // use this can calculate vertical seam map
    console.time('vertical');
    this.calculateVerticalSeamMap(pairList, heatMap);
    console.timeEnd('vertical');

    // Second compute best 1-edge path for all pairs of cols
    // hungaryMap, if pairList has diagonal pair, it should be inf
    let pairColList: number[][] = [];
    for (let x = 0; x < width - 1; x += 1) {
      pairColList[x] = [];

      /// Hungarian algorithm
      /// -------------------
      let hungaryMap: number[][] = [];
      for (let i = 0; i < height; i += 1) {
        hungaryMap[i] = [];
        pairColList[x][i] = 0;
        for (let j = 0; j < height; j += 1) {
          hungaryMap[i][j] = Math.abs(i - j) <= 1 ? heatMap[i][x] + heatMap[j][x + 1] : inf;
          if (pairList[i][x] === x + 1 || pairList[j][x + 1] === x) {
            hungaryMap[i][j] = inf;
          }
        }
      }

      // step1
      for (let i = 0; i < height; i += 1) {
        const minVal = minRow(hungaryMap, i, i, height);
        for (let j = Math.max(0, i - 1); j < Math.min(i + 1, height); j += 1) {
          hungaryMap[i][j] -= minVal;
        }
      }
      for (let i = 0; i < height; i += 1) {
        const minVal = minCol(hungaryMap, i, i, height);
        for (let j = Math.max(0, i - 1); j < Math.min(i + 1, height); j += 1) {
          hungaryMap[j][i] -= minVal;
        }
      }

      console.time('hungarian');
      while (true) {
        // step2
        let zeroCoordinate: number[][] = [];
        for (let i = 0; i < height; i += 1) {
          for (let j = Math.max(0, i - 1); j < Math.min(i + 1, height); j += 1) {
            if (hungaryMap[i][j] === 0) {
              zeroCoordinate.push([i, j]);
            }
          }
        }
        let checkRow: number[] = [];
        let checkCol: number[] = [];
        for (const elem of zeroCoordinate) {
          let flag = false;
          for (let i = 0, len = checkRow.length; i < len; i++) {
            if (checkRow[i] === elem[0]) {
              flag = true;
              break;
            }
          }
          for (let i = 0, len = checkCol.length; !flag && i < len; i++) {
            if (checkCol[i] === elem[1]) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            checkRow.push(elem[0]);
            checkCol.push(elem[1]);
          }
        }
        if (checkRow.length === width) {
          for (let i = 0, len = checkRow.length; i < len; i++) {
            pairColList[x][checkRow[i]] = checkCol[i];
          }
          break;
        }

        // step3
        let rowCount: number[] = new Array<number>(height);
        let colCount: number[] = new Array<number>(height);
        let lineR: number[] = [];
        let lineC: number[] = [];
        while (zeroCoordinate.length > 0) {
          let maxZero = 0;
          let mode = 0;
          let ind = 0;
          for (const elem of zeroCoordinate) {
            if (rowCount[elem[0]]) {
              rowCount[elem[0]] += 1;
            } else {
              rowCount[elem[0]] = 1;
            }
            if (colCount[elem[1]]) {
              colCount[elem[1]] += 1;
            } else {
              colCount[elem[1]] = 1;
            }
            if (maxZero < rowCount[elem[0]]) {
              maxZero = rowCount[elem[0]];
              mode = 0;
              ind = elem[0];
            }
            if (maxZero < colCount[elem[1]]) {
              maxZero = colCount[elem[1]];
              mode = 1;
              ind = elem[1];
            }
          }
          if (mode === 0) {
            lineR.push(ind);
            zeroCoordinate = zeroCoordinate.filter((value: number[]) => {
              return value[0] !== ind;
            });
          } else {
            lineC.push(ind);
            zeroCoordinate = zeroCoordinate.filter((value: number[]) => {
              return value[1] !== ind;
            });
          }
          rowCount = new Array<number>(height);
          colCount = new Array<number>(height);
        }

        // step4
        let minVal = Number.MAX_VALUE;
        for (let i = 0; i < height; i += 1) {
          let flag = false;
          for (let k = 0, len = lineR.length; k < len; k += 1) {
            if (lineR[k] === i) {
              flag = true;
              break;
            }
          }
          if (flag) {
            continue;
          }
          for (let j = Math.max(0, i - 1); j < Math.min(i + 1, height); j += 1) {
            for (let k = 0, len = lineC.length; k < len; k += 1) {
              if (lineC[k] === j) {
                flag = true;
                break;
              }
            }
            if (flag) {
              flag = false;
              continue;
            }
            if (minVal > hungaryMap[i][j]) {
              minVal = hungaryMap[i][j];
            }
          }
        }
        for (let i = 0; i < height; i += 1) {
          let flagR = false;
          for (let k = 0, len = lineR.length; k < len; k += 1) {
            if (lineR[k] === i) {
              flagR = true;
              break;
            }
          }
          for (let j = Math.max(0, i - 1); j < Math.min(i + 1, height); j += 1) {
            let flagC = false;
            for (let k = 0, len = lineC.length; k < len; k += 1) {
              if (lineC[k] === j && flagR) {
                hungaryMap[i][j] += minVal;
                flagC = true;
                break;
              }
            }
            if (!flagC && !flagR) {
              hungaryMap[i][j] -= minVal;
            }
          }
        }
      }
      console.timeEnd('hungarian');
    }

    // pairColList is 1-edge information
    // use this can calculate horizontal seam map
    this.calculateHorizontalSeamMap(pairColList, heatMap);
  }


  /**
   * Calculate Vertical Consistency Seam Map
   * @param pairList 
   * @param heatMap 
   */
  calculateVerticalSeamMap(pairList: number[][], heatMap: number[][]) {
    const M = heatMap.slice();
    const width = this.imageData.width;
    const height = this.imageData.height;
    let backtrack = pairList.slice();
    let addr: number[] = []

    // Building M map by DP and prepair backtrack
    for (let y = 1; y < height; y++) {
      this.consistentVerticalMap[y] = [];
      for (let x = 0; x < width; x++) {
        this.consistentVerticalMap[y][x] = 0;
        addr[x] = x;
        M[y][pairList[y - 1][x]] += M[y - 1][x];
        backtrack[y][pairList[y - 1][x]] = x;
      }
    }

    // Quicksort last row
    const quickSort = (arr: number[], left: number, right: number) => {
      let pivot = 0;
      let partitionIndex = 0;
      if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);
        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
      }
    }
    const partition = (arr: number[], pivot: number, left: number, right: number) => {
      const pivotValue = arr[pivot];
      let partitionIndex = left;

      for (let i = left; i < right; i++) {
        if (arr[i] < pivotValue) {
          swap(arr, i, partitionIndex);
          partitionIndex += 1;
        }
      }
      swap(arr, right, partitionIndex);
      return partitionIndex;
    }
    const swap = (arr: number[], i: number, j: number) => {
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
      const temp2 = addr[i];
      addr[i] = addr[j];
      addr[j] = temp2;
    }
    quickSort(M[height - 1], 0, width - 1);

    // Backtrack and consist consistentVerticalMap
    for (let x = 0; x < width; x++) {
      this.consistentVerticalMap[height - 1][addr[x]] = x + 1;
      for (let y = height - 1; y >= 1; y--) {
        this.consistentVerticalMap[y - 1][backtrack[y][x]] = this.consistentVerticalMap[y][x];
      }
    }
  }

  calculateHorizontalSeamMap(pairList: number[][], heatMap: number[][]) {
    const M = heatMap.slice();
    const width = this.imageData.width;
    const height = this.imageData.height;
    let backtrack = pairList.slice();
    let addr: number[] = []

    // Building M map by DP and prepair backtrack
    for (let x = 1; x < width; x++) {
      for (let y = 0; y < height; y++) {
        addr[y] = y;
        M[pairList[x - 1][y]][x] += M[y][x - 1];
        backtrack[pairList[x - 1][y]][x] = y;
      }
    }

    // Quicksort last row
    const quickSort = (arr: number[], left: number, right: number) => {
      let pivot = 0;
      let partitionIndex = 0;
      if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);
        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
      }
    }
    const partition = (arr: number[], pivot: number, left: number, right: number) => {
      const pivotValue = arr[pivot];
      let partitionIndex = left;

      for (let i = left; i < right; i++) {
        if (arr[i] < pivotValue) {
          swap(arr, i, partitionIndex);
          partitionIndex += 1;
        }
      }
      swap(arr, right, partitionIndex);
      return partitionIndex;
    }
    const swap = (arr: number[], i: number, j: number) => {
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
      const temp2 = addr[i];
      addr[i] = addr[j];
      addr[j] = temp2;
    }
    let lastCol: number[] = [];
    for (let y = 0; y < height; y++) {
      lastCol[y] = M[y][width - 1];
    }
    quickSort(lastCol, 0, height - 1);

    // Backtrack and consist consistentHorizontalMap
    for (let y = 0; y < height; y++) {
      this.consistentHorizontalMap[addr[y]][width - 1] = y + 1;
      for (let x = width - 1; x >= 1; x--) {
        this.consistentHorizontalMap[backtrack[y][x]][x - 1] = this.consistentHorizontalMap[y][x];
      }
    }
  }

  /**
   * Find optimal seam map by energy
   * @param energy 
   */
  findOptimalSeam(energy: number[][]) {
    const min = (x: number, y: number): number => {
      return x < y ? x : y;
    }

    // Find M - minimum energy for all possible seams for each (x,y)
    let M = energy.slice();
    const height = energy.length;
    const width = energy[0].length;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const vl = x - 1 > 0 ? M[y - 1][x - 1] : Number.MAX_VALUE;
        const vm = M[y - 1][x];
        const vr = x + 1 < width ? M[y - 1][x + 1] : Number.MAX_VALUE;
        M[y][x] += min(vl, min(vm, vr));
      }
    }

    // Find the minimum value in the last row of M
    let val = Number.MAX_VALUE;
    let indexX = -1;
    for (let x = 0; x < width; x++) {
      if (val > M[height - 1][x]) {
        val = M[height - 1][x];
        indexX = x;
      }
    }

    // Traverse back choosing pixels with minimum energy.
    let seamEnergy = val;
    let optSeamMask: number[][] = [];
    for (let y = height - 1; y >= 1; y--) {
      optSeamMask[y] = [];
      for (let x = 0; x < width; x++) {
        optSeamMask[y][x] = 0;
      }
      optSeamMask[y][indexX] = 1;
      const vl = M[y - 1][indexX - 1];
      const vm = M[y - 1][indexX];
      const vr = M[y - 1][indexX + 1];

      seamEnergy += seamEnergy + min(vl, min(vm, vr));
      indexX += (vl < vm ? (vl < vr ? -1 : 1) : (vm < vr ? 0 : 1));
    }

    for (let x = 0; x < width; x++) {
      optSeamMask[0][x] = 0;
    }
    optSeamMask[0][indexX] = 1;

    this._seamEnergy = seamEnergy;
    return optSeamMask;
  }

  /**
   * Add or Delete Seam by operation
   * @param transBitMask 
   * @param sizeReduction 
   * @param image 
   * @param operation 
   */
  addOrDeleteSeams(transBitMask: number[][], sizeReduction: number[], image: ImageDataWrapper, operation: Function) {
    let y = transBitMask.length - 1;
    let x = transBitMask[0].length - 1;

    for (let it = 0; it < sizeReduction[0] + sizeReduction[1]; it++) {
      const energy = this.sobelEnergy(image);
      if (transBitMask[y][x] === 0) {
        const optSeamMask = this.findOptimalSeam(energy);
        image = operation(image, optSeamMask, false);
        y = y - 1;
      } else {
        const optSeamMask = this.findOptimalSeam(energy);
        image = operation(image, optSeamMask, true);
        x = x - 1;
      }
    }
  }

  /**
   * Reduce Image by mask
   * @param image 
   * @param seamMask 
   * @param isVertical 
   */
  reduceImageByMask(image: ImageDataWrapper, seamMask: number[][], isVertical: boolean) {
    image.deleteSeam(seamMask, isVertical);
    return image;
  }

  /**
   * Calculate Energy Map by Sobel filter
   * @param pixels 
   */
  sobelEnergy(pixels: ImageDataWrapper) {
    const b = (x: number, y: number): number => {
      if (x < 0 || y < 0 || x >= pixels.width || y >= pixels.height) {
        return 0;
      }
      const data = pixels.editedData[y][x];
      return data[0] + data[1] + data[2];
    }
    const dot = (a: number[], b: number[]): number => {
      if (a.length !== b.length) {
        return 0;
      }
      let sum = 0;
      for (let i = 0, len = a.length; i < len; i++) {
        sum += a[i] * b[i];
      }
      return sum;
    }
    const xMap = [
      -1, 0, 1,
      -2, 0, 2,
      -1, 0, 1
    ];
    const yMap = [
      -1, -2, -1,
      0, 0, 0,
      1, 2, 1
    ];
    let energyMap: number[][] = [];
    for (let y = 0, height = pixels.height; y < height; y++) {
      energyMap[y] = [];
      for (let x = 0, width = pixels.width; x < width; x++) {
        const bMap = [
          b(x - 1, y - 1), b(x, y - 1), b(x + 1, y - 1),
          b(x - 1, y), b(x, y), b(x + 1, y),
          b(x - 1, y + 1), b(x, y + 1), b(x + 1, y + 1)
        ];
        const xenergy = dot(xMap, bMap);
        const yenergy = dot(yMap, bMap);
        energyMap[y][x] = Math.sqrt(xenergy * xenergy + yenergy * yenergy);
      }
    }
    return energyMap;
  }
}

class ImageDataWrapper {
  originalData: ImageData;
  editedData: number[][][];
  verticalMap: number[][];
  horizontalMap: number[][];
  count: number;

  get width() { return this.originalData.width; }
  get height() { return this.originalData.height; }
  // get width() { return this.editedData[0].length; }
  // get height() { return this.editedData.length; }

  constructor(image: ImageData) {
    this.originalData = image;
    this.count = 0;

    // initialize map
    this.verticalMap = [];
    this.horizontalMap = [];
    this.editedData = [];
    for (let y = 0, height = this.height; y < height; y++) {
      this.verticalMap[y] = [];
      this.horizontalMap[y] = [];
      this.editedData[y] = [];
      for (let x = 0, width = this.width; x < width; x++) {
        this.verticalMap[y][x] = 0;
        this.horizontalMap[y][x] = 0;
        this.editedData[y][x] = this.getPixel(x, y);
      }
    }
  }

  /**
   * Get pixel data from original image data
   * @param x 
   * @param y 
   */
  getPixel(x: number, y: number): number[] {
    const offset = y * this.originalData.width + x;
    const data = this.originalData.data;
    return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
  }

  /**
   * Construct editedData and Map
   * @param seamMap 
   * @param isVerticalSeam 
   */
  deleteSeam(seamMap: number[][], isVerticalSeam: boolean) {
    this.count += 1;
    const newData: number[][][] = [];
    if (isVerticalSeam) {
      for (let y = 0, height = seamMap.length; y < height; y++) {
        let x0 = 0;
        for (let x = 0, width = seamMap[0].length; x < width; x++) {
          if (seamMap[y][x] === 0) {
            newData[y][x0] = this.editedData[y][x];
            x0 += 1;
          }
        }
      }
    } else {
      for (let x = 0, width = seamMap[0].length; x < width; x++) {
        let y0 = 0;
        for (let y = 0, height = seamMap.length; y < height; y++) {
          if (seamMap[y][x] === 0) {
            newData[y0][x] = this.editedData[y][x];
            y0 += 1;
          }
        }
      }
    }
    this.editedData = newData.slice();
  }
}
/**
 * Seam Carving Impelementation
 */

const inf = Infinity;
const minf = -Infinity;

export default class SeamCarver {
  imageData: ImageDataWrapper;
  consistentVerticalMap: number[][];
  consistentHorizontalMap: number[][];
  sobelImage: ImageData;

  constructor(public image: ImageData) {
    this.imageData = new ImageDataWrapper(image);
    this.consistentHorizontalMap = [];
    this.consistentVerticalMap = [];
    for (let y = 0; y < this.imageData.height; y++) {
      this.consistentHorizontalMap[y] = [];
      this.consistentVerticalMap[y] = [];
      for (let x = 0; x < this.imageData.width; x++) {
        this.consistentHorizontalMap[y][x] = 0;
        this.consistentVerticalMap[y][x] = 0;
      }
    }

    this.constructConsistentMap();
  }

  constructConsistentMap() {
    const heatMap = this.sobelEnergy(this.imageData);
    const height = this.imageData.height;
    const width = this.imageData.width;
    let newImage = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const base = (y * width + x) * 4;
        newImage[base] = Math.floor(heatMap[y][x]);
        newImage[base + 1] = Math.floor(heatMap[y][x]);
        newImage[base + 2] = Math.floor(heatMap[y][x]);
        newImage[base + 3] = 255;
      }
    }
    this.sobelImage = new ImageData(newImage, width, height);
    console.time('consistent');
    const mMap = this.calculateVerticalSeamMap(heatMap);
    // traverse
    let trHeat: number[][] = [];
    for (let x = 0; x < width; x++) {
      trHeat[x] = [];
      for (let y = 0; y < height; y++) {
        trHeat[x][y] = heatMap[y][x];
      }
    }
    this.calculateHorizontalSeamMap(trHeat, mMap);
    console.timeEnd('consistent');
  }

  resize(width: number, height: number) {
    width = Math.floor(width);
    height = Math.floor(height);
    let horizontalMap: number[][] = [];
    let image = this.image;
    let newImage = new Uint8ClampedArray(width * image.height * 4);
    let resizedImage = new Uint8ClampedArray(width * height * 4);
    // First compute vertical
    if (image.width >= width) {
      const widthDiff = image.width - width;
      for (let y = 0; y < image.height; y++) {
        horizontalMap[y] = [];
        let x0 = 0;
        for (let x = 0; x < image.width; x++) {
          horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
          const base0 = (y * width + x0) * 4;
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
      const widthDiff = width - image.width;
      for (let y = 0; y < image.height; y++) {
        horizontalMap[y] = [];
        let x0 = 0;
        for (let x = 0; x < image.width; x++) {
          const base = (y * image.width + x) * 4;
          if (this.consistentVerticalMap[y][x] <= widthDiff) {
            horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
            const base0 = (y * width + x0) * 4;
            newImage[base0] = image.data[base];
            newImage[base0 + 1] = image.data[base + 1];
            newImage[base0 + 2] = image.data[base + 2];
            newImage[base0 + 3] = image.data[base + 3];
            x0 += 1;
          }
          horizontalMap[y][x0] = this.consistentHorizontalMap[y][x];
          const base0 = (y * width + x0) * 4;
          newImage[base0] = image.data[base];
          newImage[base0 + 1] = image.data[base + 1];
          newImage[base0 + 2] = image.data[base + 2];
          newImage[base0 + 3] = image.data[base + 3];
          x0 += 1;
        }
      }
    }
    // Second
    if (image.height >= height) {
      const heightDiff = image.height - height;
      for (let x = 0; x < width; x++) {
        let y0 = 0;
        for (let y = 0; y < image.height; y++) {
          if (horizontalMap[y][x] > heightDiff) {
            y0 += 1;
          }
          const base0 = (y0 * width + x) * 4;
          const base = (y * width + x) * 4;
          resizedImage[base0] = newImage[base];
          resizedImage[base0 + 1] = newImage[base + 1];
          resizedImage[base0 + 2] = newImage[base + 2];
          resizedImage[base0 + 3] = newImage[base + 3];
        }
      }
    } else {
      const heightDiff = height - image.height;
      for (let x = 0; x < width; x++) {
        let y0 = 0;
        for (let y = 0; y < image.height; y++) {
          const base = (y * width + x) * 4;
          if (horizontalMap[y][x] <= heightDiff) {
            const base0 = (y0 * width + x) * 4;
            resizedImage[base0] = newImage[base];
            resizedImage[base0 + 1] = newImage[base + 1];
            resizedImage[base0 + 2] = newImage[base + 2];
            resizedImage[base0 + 3] = newImage[base + 3];
            y0 += 1;
          }
          const base0 = (y0 * width + x) * 4;
          resizedImage[base0] = newImage[base];
          resizedImage[base0 + 1] = newImage[base + 1];
          resizedImage[base0 + 2] = newImage[base + 2];
          resizedImage[base0 + 3] = newImage[base + 3];
          y0 += 1;
        }
      }
    }
    return new ImageData(resizedImage, width, height);
  }

  /**
   * Calculate Vertical Consistency Seam Map
   * @param heatMap
   */
  calculateVerticalSeamMap(heatMap: number[][]) {
    const width = this.imageData.width;
    const height = this.imageData.height;

    // For calculating weights by the method of Real-time content-aware image resizing(2009)
    let A: number[][] = [];
    let M: number[][] = [];
    let mMap: number[][] = []; // for backtrack

    for (let j = 0; j <= height; j++) {
      M[j] = new Array<number>(width);
    }

    // Calculate M by dynamic programming
    for (let i = 0; i < width; i++) {
      M[height][i] = 0;
    }
    for (let j = height - 1; j >= 0; j--) {
      for (let i = 0; i < width; i++) {
        const vl = i - 1 >= 0 ? M[j + 1][i - 1] : inf;
        const vm = M[j + 1][i];
        const vr = i + 1 < width ? M[j + 1][i + 1] : inf;
        M[j][i] = heatMap[j][i] + Math.min(vl, vm, vr);
      }
    }

    // Set A[0] is energy
    A[0] = heatMap[0].slice();

    // Frist compute best 1-edge path for all pairs of rows
    let weight: number[][] = [];
    for (let i = 0; i <= width; i++) {
      weight[i] = [];
      for (let j = 0; j <= width; j++) {
        weight[i][j] = minf;
      }
    }
    for (let k = 0; k < height - 1; k++) {
      A[k + 1] = new Array(width);
      mMap[k] = new Array(width);
      // compute weight
      for (let i = 1; i <= width; i++) {
        for (let j = Math.max(i - 1, 1); j <= Math.min(i + 1, width); j++) {
          weight[i][j] = A[k][i - 1] * M[k + 1][j - 1];
        }
      }

      // calculate F(m)
      let f: number[] = [];
      f[0] = 0;
      const getF = (i: number) => {
        if (i === -1) {
          return 0;
        }
        return f[i];
      }
      for (let i = 1; i <= width; i++) {
        let f1 = getF(i - 1) + weight[i][i];
        let f2 = getF(i - 2) + weight[i - 1][i] + weight[i][i - 1];
        f[i] = Math.max(f1, f2);
      }
      // Solve the optimal matching and update A
      let x = width;
      while (x > 1) {
        let f1 = getF(x - 1) + weight[x][x];
        let f2 = getF(x - 2) + weight[x - 1][x] + weight[x][x - 1];
        if (f1 > f2) {
          // m(i,k) = i
          mMap[k][x - 1] = x - 1;
          A[k + 1][x - 1] = heatMap[k + 1][x - 1] + A[k][x - 1];
          x -= 1;
        } else {
          // m(i,k) = i-1, m(i-1,k) = i
          mMap[k][x - 1] = x - 2;
          mMap[k][x - 2] = x - 1;
          A[k + 1][x - 1] = heatMap[k + 1][x - 1] + A[k][x - 2];
          A[k + 1][x - 2] = heatMap[k + 1][x - 2] + A[k][x - 1];
          x -= 2;
        }
      }
      if (x === 1) {
        mMap[k][0] = 0;
        A[k + 1][0] = heatMap[k + 1][0] + A[k][0];
      }
    }

    let addr: number[] = [];
    for (let x = 0; x < width; x++) {
      addr[x] = x;
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
    quickSort(A[height - 1], 0, width - 1);

    // Backtrack and consist consistentVerticalMap
    for (let x = 0; x < width; x++) {
      this.consistentVerticalMap[height - 1][addr[x]] = x + 1;
    }
    for (let y = height - 1; y >= 1; y--) {
      for (let x = 0; x < width; x++) {
        this.consistentVerticalMap[y - 1][mMap[y - 1][x]] = this.consistentVerticalMap[y][x];
      }
    }
    return mMap;
  }

  /**
   * Calculate Vertical Consistency Seam Map
   * @param heatMap
   * @param vMap
   */
  calculateHorizontalSeamMap(heatMap: number[][], vMap: number[][]) {
    const width = this.imageData.width;
    const height = this.imageData.height;

    // For calculating weights by the method of Real-time content-aware image resizing(2009)
    let A: number[][] = [];
    let M: number[][] = [];
    let mMap: number[][] = []; // for backtrack

    for (let j = 0; j <= width; j++) {
      M[j] = new Array<number>(height);
    }

    // Calculate M by dynamic programming
    for (let i = 0; i < height; i++) {
      M[width][i] = 0;
    }
    for (let j = width - 1; j >= 0; j--) {
      for (let i = 0; i < height; i++) {
        const vl = i - 1 >= 0 ? M[j + 1][i - 1] : inf;
        const vm = M[j + 1][i];
        const vr = i + 1 < height ? M[j + 1][i + 1] : inf;
        M[j][i] = heatMap[j][i] + Math.min(vl, vm, vr);
      }
    }

    // Set A[0] is energy
    A[0] = heatMap[0].slice();

    // Frist compute best 1-edge path for all pairs of cols
    let weight: number[][] = [];
    for (let i = 0; i <= height; i++) {
      weight[i] = [];
      for (let j = 0; j <= height; j++) {
        weight[i][j] = minf;
      }
    }
    for (let k = 0; k < width - 1; k++) {
      A[k + 1] = new Array(height);
      mMap[k] = new Array(height);
      // compute weight
      for (let i = 1; i <= height; i++) {
        for (let j = Math.max(i - 1, 1); j <= Math.min(i + 1, height); j++) {
          weight[i][j] = A[k][i - 1] * M[k + 1][j - 1];
        }
      }

      // calculate F(m)
      let f: number[] = [];
      f[0] = 0;
      const getF = (i: number) => {
        if (i === -1) {
          return 0;
        }
        return f[i];
      }
      for (let i = 1; i <= height; i++) {
        let f1 = getF(i - 1) + weight[i][i];
        let f2 = getF(i - 2) + weight[i - 1][i] + weight[i][i - 1];
        f[i] = Math.max(f1, f2);
      }
      // Solve the optimal matching and update A
      let y = height;
      while (y > 1) {
        if (vMap[y - 2][k] !== k) {
          mMap[k][y - 1] = y - 1;
          A[k + 1][y - 1] = heatMap[k + 1][y - 1] + A[k][y - 1];
          y -= 1;
        }
        let f1 = getF(y - 1) + weight[y][y];
        let f2 = getF(y - 2) + weight[y - 1][y] + weight[y][y - 1];
        if (f1 > f2) {
          // m(i,k) = i
          mMap[k][y - 1] = y - 1;
          A[k + 1][y - 1] = heatMap[k + 1][y - 1] + A[k][y - 1];
          y -= 1;
        } else {
          // m(i,k) = i-1, m(i-1,k) = i
          mMap[k][y - 1] = y - 2;
          mMap[k][y - 2] = y - 1;
          A[k + 1][y - 1] = heatMap[k + 1][y - 1] + A[k][y - 2];
          A[k + 1][y - 2] = heatMap[k + 1][y - 2] + A[k][y - 1];
          y -= 2;
        }
      }
      if (y === 1) {
        mMap[k][0] = 0;
        A[k + 1][0] = heatMap[k + 1][0] + A[k][0];
      }
    }

    let addr: number[] = [];
    for (let y = 0; y < height; y++) {
      addr[y] = y;
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
    quickSort(A[width - 1], 0, height - 1);

    // Backtrack and consist consistentVerticalMap
    for (let y = 0; y < height; y++) {
      this.consistentHorizontalMap[addr[y]][width - 1] = y + 1;
    }
    for (let x = width - 1; x >= 1; x--) {
      for (let y = 0; y < height; y++) {
        this.consistentHorizontalMap[mMap[x - 1][y]][x - 1] = this.consistentHorizontalMap[y][x];
      }
    }
  }

  /**
   * Calculate Energy Map by Sobel filter
   * @param pixels
   */
  sobelEnergy(pixels: ImageDataWrapper) {
    const b = (x: number, y: number): number => {
      if ((x < 0 && y < 0) || (x < 0 && y >= pixels.height)
        || (x >= pixels.width && y < 0) || (x >= pixels.width && y >= pixels.height)) {
        return 0;
      }
      let data: number[] = [];
      if (x < 0) {
        data = pixels.editedData[y][0];
      } else if (y < 0) {
        data = pixels.editedData[0][x];
      } else if (x >= pixels.width) {
        data = pixels.editedData[y][pixels.width - 1];
      } else if (y >= pixels.height) {
        data = pixels.editedData[pixels.height - 1][x];
      } else {
        data = pixels.editedData[y][x];
      }
      return 0.299 * data[0] + 0.587 * data[1] + 0.114 * data[2];
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
        let xenergy = dot(xMap, bMap);
        let yenergy = dot(yMap, bMap);
        energyMap[y][x] = Math.sqrt(xenergy * xenergy + yenergy * yenergy);
        if (energyMap[y][x] > 255) energyMap[y][x] = 255;
        else if (energyMap[y][x] < 0) energyMap[y][x] *= -1;
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
    const offset = (y * this.originalData.width + x) * 4;
    const data = this.originalData.data;
    return [
      data[offset], data[offset + 1],
      data[offset + 2], data[offset + 3]
    ];
  }
}

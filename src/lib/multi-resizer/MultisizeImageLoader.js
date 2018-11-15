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

    const widthDiff = this.image.width - seamFactHorizontal;
    console.log(widthDiff);

    if (widthDiff >= 0) {
      for (let y = 0; y < this.image.height; y++) {
        let x0 = 0;
        for (let x = 0; x < this.image.width; x++) {
          if (this.metainfo.seamMap[y][x] >= widthDiff) {
            const newBase = (y * width + x0) * 4;
            const oldBase = (y * this.image.width + x) * 4;
            newImage.data[newBase] = this.image.data[oldBase];
            newImage.data[newBase + 1] = this.image.data[oldBase + 1];
            newImage.data[newBase + 2] = this.image.data[oldBase + 2];
            newImage.data[newBase + 3] = this.image.data[oldBase + 3];
            x0++;
          }
        }
      }
    } else {
      for (let y = 0; y < this.image.height; y++) {
        let x0 = 0;
        for (let x = 0; x < this.image.width; x++) {
          if (this.metainfo.seamMap[y][x] <= -widthDiff) {
            const newBase = (y * width + x0) * 4;
            const oldBase = (y * this.image.width + x) * 4;
            newImage.data[newBase] = this.image.data[oldBase];
            newImage.data[newBase + 1] = this.image.data[oldBase + 1];
            newImage.data[newBase + 2] = this.image.data[oldBase + 2];
            newImage.data[newBase + 3] = this.image.data[oldBase + 3];
            x0++;
          }
          const newBase = (y * width + x0) * 4;
          const oldBase = (y * this.image.width + x) * 4;
          newImage.data[newBase] = this.image.data[oldBase];
          newImage.data[newBase + 1] = this.image.data[oldBase + 1];
          newImage.data[newBase + 2] = this.image.data[oldBase + 2];
          newImage.data[newBase + 3] = this.image.data[oldBase + 3];
          x0++;
        }
      }
    }
    console.log(newImage);
    return newImage;
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
    console.log({
      left: left,
      right: right,
      value: value,
      keyFrames: keyFrames
    })
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

class MultiSizeImage extends HTMLElement {

  constructor() {
    super();
    this._msiSrc = null;
    this._timer = 0;
    this._resizer = null;

    const shadow = this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    this._canvas = document.createElement('canvas');
    this._canvas.setAttribute('class', 'main_canvas');
    this._mainCtx = this._canvas.getContext('2d');

    this._imageCanvas = document.createElement('canvas');
    this._imageCtx = this._canvas.getContext('2d');

    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        display: block;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
      }
      
      .main_canvas {
        display: block;
        margin: 0;
        padding: 0;
      }
    `

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(this._canvas);
  }

  static get observedAttributes() {
    return ["src"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._msiSrc = newValue;
    this._updateSrc();
  }

  connectedCallback() {
    this._updateSrc();
  }

  get src() {
    return this._msiSrc;
  }

  set src(v) {
    this.setAttribute("src", v);
  }

  onresize() {
    if (this._timer > 0) {
      clearTimeout(this._timer);
    }

    this._timer = setTimeout(function () {
      this._drawImage();
    }, 200);
  }

  _drawImage() {
    const width = this.clientWidth;
    const height = this.clientHeight;
    const img = this._resizer.seamImageData(width, height);
    const originX = this._resizer.originX(width);
    const originY = this._resizer.originY(height);
    const scaleX = this._resizer.scaleX(width);
    const scaleY = this._resizer.scaleY(height);

    this._canvas.width = width;
    this._canvas.height = height;
    this._imageCtx.clearRect(0, 0, width, height);
    this._imageCtx.putImageData(img, 0, 0);
    this._mainCtx.clearRect(0, 0, width, height);
    this._mainCtx.scale(scaleX, scaleY);
    this._mainCtx.drawImage(this._imageCanvas, originX, originY);
    this._mainCtx.scale(1 / scaleX, 1 / scaleY);
  }

  _updateSrc() {
    if (!this._msiSrc) {
      this._mainCtx.clearRect(0, 0, this._mainCtx.width, this._mainCtx.height);
      this._imageCtx.clearRect(0, 0, this._imageCtx.width, this._imageCtx.height);
      this._resizer = null;
      return;
    }

    // TODO: zipとしてmsiファイルを読み込む
    this._drawImage();
  }
}

customElements.define('m-img', MultiSizeImage);
/**
 * Copyrights touyou.
 * depends on zip.js (https://gildas-lormeau.github.io/zip.js/)
 */

import {
  MultiResizer
} from './multiResizer';
import {
  RbfWebResizer
} from './rbfResizer';
import {
  zip
} from './zip';

class MultiSizeImage extends HTMLElement {

  constructor() {
    super();
    this._rvgSrc = null;
    this._timer = 0;
    this._resizer = null;
    this._metainfo = null;
    this._fileUrl = null;
    this._linear = true;

    const scriptPathFetch = function () {
      if (document.currentScript) {
        return document.currentScript;
      } else {
        let scripts = document.getElementsByTagName('script');
        script = scripts[scripts.length - 1];
        if (script.src) {
          return script.src;
        }
      }
    }
    this._scriptPath = scriptPathFetch().src.split('/').slice(0, -1).join('/');

    const shadow = this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    this._canvas = document.createElement('canvas');
    this._canvas.setAttribute('class', 'main_canvas');
    this._mainCtx = this._canvas.getContext('2d');

    this._imageCanvas = document.createElement('canvas');
    this._imageCanvas.setAttribute('class', 'hidden_canvas');
    this._imageCtx = this._imageCanvas.getContext('2d');

    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        display: block;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        overflow: hidden;
      }

      .main_canvas {
        display: block;
        margin: 0;
        padding: 0;
      }

      .hidden_canvas {
        display: none;
      }
    `

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(this._canvas);
    wrapper.appendChild(this._imageCanvas);
  }

  static get observedAttributes() {
    return ["src"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._rvgSrc = newValue;
    if (oldValue === newValue) {
      return;
    }
    this._updateSrc();
  }

  connectedCallback() {
    this._updateSrc();
  }

  get src() {
    return this._rvgSrc;
  }

  set src(v) {
    this.setAttribute("src", v);
  }

  _onresize() {
    if (this._timer > 0) {
      clearTimeout(this._timer);
    }

    const that = this;
    this._timer = setTimeout(function () {
      that._drawImage(that._linear);
    }, 200);
  }

  /**
   * drawing method
   * @param {boolean} linear
   */
  _drawImage(linear) {
    if (linear) {
      const width = this.clientWidth;
      const height = this.clientHeight;
      const img = this._resizer.seamImageData(width, height);
      const originX = this._resizer.originX(width);
      const originY = this._resizer.originY(height);
      const scaleX = this._resizer.scaleX(width);
      const scaleY = this._resizer.scaleY(height);

      this._canvas.width = width;
      this._canvas.height = height;
      this._imageCanvas.width = img.width;
      this._imageCanvas.height = img.height;
      this._imageCtx.clearRect(0, 0, this._imageCanvas.width, this._imageCanvas.height);
      this._imageCtx.putImageData(img, 0, 0);
      this._mainCtx.clearRect(0, 0, width, height);
      this._mainCtx.scale(scaleX, scaleY);
      this._mainCtx.drawImage(this._imageCanvas, originX, originY);
      this._mainCtx.scale(1 / scaleX, 1 / scaleY);
    } else {
      const width = this.clientWidth;
      const height = this.clientHeight;
      const img = this._resizer.seamImageData(width, height);
      const originX = this._resizer.originX(width, height);
      const originY = this._resizer.originY(width, height);
      const scaleX = this._resizer.hScale(width, height);
      const scaleY = this._resizer.vScale(width, height);

      this._canvas.width = width;
      this._canvas.height = height;
      this._imageCanvas.width = img.width;
      this._imageCanvas.height = img.height;
      this._imageCtx.clearRect(0, 0, this._imageCanvas.width, this._imageCanvas.height);
      this._imageCtx.putImageData(img, 0, 0);
      this._mainCtx.clearRect(0, 0, width, height);
      this._mainCtx.scale(scaleX, scaleY);
      this._mainCtx.drawImage(this._imageCanvas, originX, originY);
      this._mainCtx.scale(1 / scaleX, 1 / scaleY);
    }
  }

  _updateSrc() {
    if (!this._rvgSrc) {
      this._mainCtx.clearRect(0, 0, this._mainCtx.width, this._mainCtx.height);
      this._imageCtx.clearRect(0, 0, this._imageCtx.width, this._imageCtx.height);
      this._rvgSrc = null;
      this._timer = 0;
      this._resizer = null;
      this._unzipTimer = 0;
      this._metainfo = null;
      this._fileUrl = null;
      return;
    }

    const that = this;
    zip.workerScripts = {
      deflater: [this._scriptPath + '/worker_pako.js'],
      inflater: [this._scriptPath + '/worker_pako.js'],
    };
    zip.createReader(new zip.HttpReader(this._rvgSrc), function (reader) {
      reader.getEntries(function (entries) {
        for (const entry of entries) {
          if (entry.filename === 'metainfo.json') {
            entry.getData(new zip.TextWriter(), function (text) {
              that._metainfo = JSON.parse(text);
            });
          } else if (entry.filename === 'image.png') {
            entry.getData(new zip.BlobWriter(), function (blob) {
              that._fileUrl = URL.createObjectURL(blob);
            });
          }
        }

        let unzipTimer = setInterval(function () {
          if (that._metainfo && that._fileUrl) {
            that._image = new Image();
            that._image.src = that._fileUrl;
            that._linear = that._metainfo.linear
            if (that._linear) {
              that._image.onload = () => {
                const tmpCanvas = document.createElement('canvas');
                const tmpCtx = tmpCanvas.getContext('2d');
                tmpCanvas.width = that._image.naturalWidth;
                tmpCanvas.height = that._image.naturalHeight;
                tmpCtx.drawImage(that._image, 0, 0, that._image.naturalWidth, that._image.naturalHeight);
                that._resizer = new MultiResizer(tmpCtx.getImageData(0, 0, that._image.naturalWidth, that._image.naturalHeight), {
                  originXKeys: that._metainfo.keys.originXKeys,
                  originYKeys: that._metainfo.keys.originYKeys,
                  widthKeys: that._metainfo.keys.widthKeys,
                  heightKeys: that._metainfo.keys.heightKeys,
                  scaleXKeys: that._metainfo.keys.scaleXKeys,
                  scaleYKeys: that._metainfo.keys.scaleYKeys,
                  verticalSeamMap: that._metainfo.verticalSeamMap,
                  horizontalSeamMap: that._metainfo.horizontalSeamMap,
                });
                that._drawImage(that._linear);
              }
            } else {
              that._image.onload = () => {
                const tmpCanvas = document.createElement('canvas');
                const tmpCtx = tmpCanvas.getContext('2d');
                tmpCanvas.width = that._image.naturalWidth;
                tmpCanvas.height = that._image.naturalHeight;
                tmpCtx.drawImage(that._image, 0, 0, that._image.naturalWidth, that._image.naturalHeight);
                that._resizer = new RbfWebResizer(tmpCtx.getImageData(0, 0, that._image.naturalWidth, that._image.naturalHeight), that._metainfo);
                that._drawImage(that._linear);
              }
            }
            clearInterval(unzipTimer);
          }
        }, 100);
      })
    });
  }
}

customElements.define('r-img', MultiSizeImage);
window.addEventListener('resize', function () {
  const multImgs = document.getElementsByTagName('r-img');
  for (const multImg of multImgs) {
    multImg._onresize();
  }
});

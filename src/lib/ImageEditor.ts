export default class ImageEditor {
    /**
     * constructor
     * @param {ImageData} image
     */
    constructor(public image: ImageData) {
    }

    /**
     * Grayscale filter to this.image
     * @param fillRGBA 
     */
    public grayscale(fillRGBA: boolean): Uint8ClampedArray {
        const pixels = this.image.data;
        const height = this.image.height;
        const width = this.image.width;
        let gray = new Uint8ClampedArray(fillRGBA ? pixels.length : pixels.length >> 2);
        let p = 0;
        let w = 0;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                // Gray scale filter
                const value = pixels[w] * 0.299 + pixels[w + 1] * 0.587 + pixels[w + 2] * 0.114;
                gray[p++] = value;
                if (fillRGBA) {
                    gray[p++] = value;
                    gray[p++] = value;
                    gray[p++] = pixels[w + 3];
                }
                w += 4;
            }
        }
        return gray;
    }

    /**
     * Fast vertical separable convolution
     * reference: https://trackingjs.com/api/Image.js.html
     * @param pixels 
     * @param weightsVector 
     * @param opaque 
     */
    private verticalConvolve(pixels: Float32Array, weightsVector: Float32Array, opaque: boolean): Float32Array {
        const side = weightsVector.length;
        const halfSide = Math.floor(side / 2);
        const height = this.image.height;
        const width = this.image.width;
        const alphaFac = opaque ? 1 : 0;
        let output = new Float32Array(width * height * 4);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const sy = y;
                const sx = x;
                const offset = (y * width + x) * 4;
                let r = 0;
                let g = 0;
                let b = 0;
                let a = 0;
                for (let cy = 0; cy < side; cy++) {
                    const scy = Math.min(height - 1, Math.max(0, sy + cy - halfSide));
                    const scx = sx;
                    const poffset = (scy * width + scx) * 4;
                    const wt = weightsVector[cy];
                    r += pixels[poffset] * wt;
                    g += pixels[poffset + 1] * wt;
                    b += pixels[poffset + 2] * wt;
                    a += pixels[poffset + 3] * wt;
                }
                output[offset] = r;
                output[offset + 1] = g;
                output[offset + 2] = b;
                output[offset + 3] = a * alphaFac * (255 - a);
            }
        }
        return output;
    }

    /**
     * Fast horizontal separable convolution
     * @param pixels 
     * @param weightsVector 
     * @param opaque 
     */
    private horizontalConvolve(pixels: Float32Array, weightsVector: Float32Array, opaque: boolean): Float32Array {
        const side = weightsVector.length;
        const halfSide = Math.floor(side / 2);
        const height = this.image.height;
        const width = this.image.width;
        const alphaFac = opaque ? 1 : 0;
        let output = new Float32Array(width * height * 4);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const sy = y;
                const sx = x;
                const offset = (y * width + x) * 4;
                let r = 0;
                let g = 0;
                let b = 0;
                let a = 0;
                for (let cx = 0; cx < side; cx++) {
                    const scy = sy;
                    const scx = Math.min(width - 1, Math.max(0, sx + cx - halfSide));
                    const poffset = (scy * width + scx) * 4;
                    const wt = weightsVector[cx];
                    r += pixels[poffset] * wt;
                    g += pixels[poffset + 1] * wt;
                    b += pixels[poffset + 2] * wt;
                    a += pixels[poffset + 3] * wt;
                }
                output[offset] = r;
                output[offset + 1] = g;
                output[offset + 2] = b;
                output[offset + 3] = a * alphaFac * (255 - a);
            }
        }
        return output;
    }

    /**
     * Fast separable convolutions
     * @param pixels
     * @param horizontalWeights 
     * @param verticalWeights 
     * @param opaque 
     */
    public separableConvolve(pixels: Float32Array, horizontalWeights: Float32Array, verticalWeights: Float32Array, opaque: boolean): Float32Array {
        const vertical = this.verticalConvolve(pixels, verticalWeights, opaque);
        return this.horizontalConvolve(vertical, horizontalWeights, opaque);
    }

    /**
     * Sobel filter
     */
    public sobelFilter(): Float32Array {
        const pixels = Float32Array.from(this.grayscale(true));
        const sobelSignVector = new Float32Array([-1, 0, 1]);
        const sobelScaleVector = new Float32Array([1, 2, 1]);
        const vertical = this.separableConvolve(pixels, sobelSignVector, sobelScaleVector, true);
        const horizontal = this.separableConvolve(pixels, sobelScaleVector, sobelSignVector, true);
        let output = new Float32Array(this.image.width * this.image.height * 4);

        for (let i = 0; i < output.length; i += 4) {
            const v = vertical[i];
            const h = horizontal[i];
            const p = Math.sqrt(h * h + v * v);
            output[i] = p;
            output[i + 1] = p;
            output[i + 2] = p;
            output[i + 3] = 255;
        }
        return output;
    }


}
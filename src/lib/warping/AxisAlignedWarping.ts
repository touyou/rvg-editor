/**
 * Retargeting Implementation 
 */
import * as func from './Functions';
import * as linear from './Matrix';

export default class Warping {
    image?: Uint8ClampedArray;
    width: number = 0;
    height: number = 0;
    saliency: linear.Matrix;
    private srow: linear.Vector;
    private scol: linear.Vector;

    /**
     * N is column and M is rows
     */
    constructor(
        private imageData: ImageData, public N: number, public M: number
    ) {
        this.image = this.imageData.data;
        this.width = this.imageData.width;
        this.height = this.imageData.height;

        // Initialize s
        this.srow = linear.Vector.fill(M, this.width / M);
        this.scol = linear.Vector.fill(N, this.height / N);

        this.saliency = linear.Matrix.zeros(this.width, this.height);
    }

    /**
     * As-Similar-As-Possible
     */
    public asap(): number {
        let K = linear.Matrix.zeros(this.N * this.M, this.N + this.M);
        let k = this.N * this.M - 1;
        while (-1 < k) {
            let r = func.r(k, this.N);
            let c = func.c(k, this.N);
            K.elements[k][r] = this.saliency.elements[r][c] * this.M / this.height;
            K.elements[k][this.M + c] = -this.saliency.elements[r][c] * this.N / this.width;
            k = (k - 1) | 0;
        }

        let s = this.srow.append(this.scol);
        let St = func.vectorToMatrix(s, 0);
        let S = func.vectorToMatrix(s, 1);
        let Kt = K.transpose();
        let KtK = Kt.dot(K);
        let E = St.dot(KtK).dot(S);
        return E.elements[0][0];
    }

    /**
     * As-Rigid-As-Possible
     */
    public arap(): number {
        let Rtop = linear.Matrix.zeros(this.N * this.M, this.N + this.M);
        let Rbtm = linear.Matrix.zeros(this.N * this.M, this.N + this.M);
        let k = this.N * this.M - 1;
        while (-1 < k) {
            let r = func.r(k, this.N);
            let c = func.c(k, this.M);
            Rtop.elements[k][r] = this.saliency.elements[r][c] * this.M / this.height;
            Rbtm.elements[k][this.M + c] = this.saliency.elements[r][c] * this.N / this.width;
        }
        let s = this.srow.append(this.scol);
        let St = func.vectorToMatrix(s, 0);
        let S = func.vectorToMatrix(s, 1);
        let Rtb = Rtop.append(Rbtm);
        let RtbT = Rtb.transpose();
        let StRtbT = St.dot(RtbT);
        let Q = StRtbT.dot(Rtb).dot(S);
        let vv = this.saliency.append(this.saliency);
        let b = StRtbT.dot(vv);
        return Q.subtract(b.multiply(2)).elements[0][0];
    }
}
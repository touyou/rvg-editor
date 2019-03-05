/**
 * RBF Interpolation
 *
 * ※ 過学習は一旦気にしない（点においてはマッチしないと編集結果と）
 */

import { linalg } from 'bluemath';
import { NDArray, sub, zeros } from '@bluemath/common';

class RBF {
  private _phi = (x: NDArray) => {
    // xをもとにφを計算する関数
    return linalg.norm(x);
  };

  private phi = (x: NDArray, c: NDArray) => {
    return this._phi(<NDArray>sub(x, c));
  };

  constructor() {
  }

  computeWeights(y: NDArray, x: Array<NDArray>) {
    const n = y.shape[0];
    let phiMat = zeros([n, n]);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const rbfValue = this.phi(x[i], x[j]);
        phiMat.set(i, j, rbfValue);
        phiMat.set(j, i, rbfValue);
      }
    }

    return this.solveLinearSystem(phiMat, y);
  }

  solveLinearSystem(A: NDArray, b: NDArray) {
    const luA = linalg.lu_custom(A);
    return linalg.solve(luA, b);
  }

  interpolate(input: NDArray, x: NDArray, w: NDArray) {
    let n = x.shape[0];
    let yInterp = 0.0;
    for (let i = 0; i < n; i++) {
      yInterp += w[i] * this.phi(input, x[i]);
    }
    return yInterp;
  }
}

let rbf = new RBF();

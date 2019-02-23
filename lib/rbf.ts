/**
 * RBF Interpolation
 *
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
        phiMat.set(i, j, this.phi(x[i], x[j]));
      }
    }

    return this.solveLinearSystem(phiMat, y);
  }

  solveLinearSystem(A: NDArray, b: NDArray) {
    const luA = linalg.lu_custom(A);
    return linalg.solve(luA, b);
  }
}

/**
 * Retargeting Implementation Helper Functions
 */

import * as linear from '../math/Matrix';

/**
 * Energy Calculation Helper
 * r(k) = Ceil(k / N)
 * @param k 
 * @param N 
 */
const r = (k: number, N: number) => {
    return Math.ceil(k / N);
}

/**
 * Energy Calculation Helper
 * c(k) = ((k - 1) mod N) + 1
 * @param k 
 * @param N 
 */
const c = (k: number, N: number) => {
    return ((k - 1) % N) + 1;
}

/**
 * Convert vector to matrix
 * @param vector 
 * @param axis 0 is column, 1 is row
 */
function vectorToMatrix(vector: linear.Vector, axis: number): linear.Matrix {
    if (axis === 0) {
        let matrix = linear.Matrix.zeros(1, vector.size);
        let i = vector.size - 1;
        while (-1 < i) {
            matrix.elements[0][i] = vector.elements[i];
            i = (i - 1) | 0;
        }
        return matrix;
    } else if (axis === 1) {
        let matrix = linear.Matrix.zeros(vector.size, 1);
        let i = vector.size - 1;
        while (-1 < i) {
            matrix.elements[i][0] = vector.elements[i];
            i = (i - 1) | 0;
        }
        return matrix;
    }
    return new linear.Matrix([]);
}

const min = (a: number, b: number): number => {
    return a < b ? a : b;
}

export { r, c, vectorToMatrix, min }
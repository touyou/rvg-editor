/**
 * Matrix Class
 */
export class Matrix {
    public elements: number[][];

    constructor(elements: number[][]) {
        this.setElements(elements);
    }

    /** accessors */
    get shape(): number[] {
        const cols = (this.elements.length === 0) ? 0 : this.elements[0].length;
        return [this.elements.length, cols];
    }
    get rows(): number { return this.elements.length; }
    get cols(): number { return this.elements[0].length; }

    /**
     * Make random matrix
     * @param n 
     * @param m 
     * @param round 
     */
    static rand(n: number, m: number, round: boolean = false): Matrix {
        if (round) {
            return Matrix.zeros(n, m).map(Math.random).map(Math.round);
        } else {
            return Matrix.zeros(n, m).map(Math.random);
        }
    }

    /**
     * Make zero filled matrix
     * @param n row 
     * @param m col
     */
    static zeros(n: number, m: number): Matrix {
        return Matrix.fill(n, m, 0);
    }

    /**
     * Make one filled matrix
     * @param n 
     * @param m 
     */
    static ones(n: number, m: number): Matrix {
        return Matrix.fill(n, m, 1);
    }

    /**
     * Make filled matrix by x
     * @param n 
     * @param m 
     * @param x 
     */
    static fill(n: number, m: number, x: number): Matrix {
        const elements: number[][] = [];
        let i = n - 1;
        let j = 0;
        while (-1 < i) {
            j = m - 1;
            elements[i] = [];
            while (-1 < j) {
                elements[i][j] = x;
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new Matrix(elements);
    }

    /**
     * Matlab like padarray (padding array)
     * @param matrix 
     * @param size 
     * @param value 
     */
    static padarray(matrix: Matrix, size: number[], value: number): Matrix {
        let newMatrix = matrix;
        let hDiff = size[0];
        let wDiff = size[1];

        for (let y = 0; y < matrix.rows; y++) {
            for (let i = 0; i < wDiff; i++) {
                newMatrix.elements[y].push(value);
            }
        }
        for (let i = 0; i < hDiff; i++) {
            let newRow: number[] = [];
            for (let x = 0; x < matrix.cols + wDiff; x++) {
                newRow[x] = value;
            }
            newMatrix.elements.push(newRow);
        }
        return newMatrix;
    }

    /**
     * Logical not operator
     * Change self elements
     */
    public not() {
        let i = this.rows - 1;
        let j = 0;
        while (-1 < i) {
            j = this.cols - 1;
            while (-1 < j) {
                if (this.elements[i][j] == 1) {
                    this.elements[i][j] = 0;
                } else {
                    this.elements[i][j] = 1;
                }
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
    }

    /**
     * row accessor
     * @param i index 1-origin
     */
    public row(i: number): Vector {
        if (i <= 0 || i > this.elements.length) {
            throw new RangeError('index out of range');
        }
        return Vector.create(this.elements[i - 1]);
    }

    /**
     * column accessor
     * @param j index 1-origin
     */
    public col(j: number): Vector {
        if (this.elements.length === 0 ||
            j <= 0 || j > this.elements[0].length) {
            throw new RangeError('index out of range');
        }
        let col: number[] = [];
        let i = this.rows - 1;
        while (-1 < i) {
            col[i] = this.elements[i][j - 1];
            i = (i - 1) | 0;
        }
        return Vector.create(col);
    }

    /**
     * 1-origin accessor
     * @param i 
     * @param j 
     */
    public at(i: number, j: number): number {
        return this.elements[i - 1][j - 1];
    }

    /**
     * Add two matrix
     * @param matrix 
     */
    public add(matrix: Matrix): Matrix {
        if (!this.isSameSizeAs(matrix)) {
            throw new Error('Matrix must be same shape');
        }
        return this.map((x: number, i: number, j: number) => x + matrix.elements[i][j]);
    }

    /**
     * Subtract two matrix
     * @param matrix 
     */
    public subtract(matrix: Matrix): Matrix {
        if (!this.isSameSizeAs(matrix)) {
            throw new Error('Matrix must be same shape');
        }
        return this.map((x: number, i: number, j: number) => x - matrix.elements[i][j]);
    }

    /**
     * Judge size
     * @param matrix 
     */
    private isSameSizeAs(matrix: Matrix): boolean {
        return (this.rows === matrix.rows && this.cols === matrix.cols);
    }

    /**
     * Element-wise multiply operator
     * @param matrix 
     */
    public multiply(matrix: number | Matrix): Matrix {
        if (typeof matrix === 'number') {
            return this.map((x: number) => x * matrix);
        } else {
            let elements: number[][] = [];
            let i = this.rows - 1;
            let j = 0;
            while (-1 < i) {
                j = this.cols - 1;
                elements[i] = [];
                while (-1 < j) {
                    elements[i][j] = this.elements[i][j] * matrix.elements[i][j];
                    j = (j - 1) | 0;
                }
                i = (i - 1) | 0;
            }
            return new Matrix(elements);
        }
    }

    /**
     * Dot operator
     * @param matrix 
     */
    public dot(matrix: Matrix): Matrix {
        if (this.cols !== matrix.rows) {
            throw new Error('invalid matrix shape');
        }
        let mat: number[][] = matrix.elements;
        let i = this.rows - 1;
        let j = 0;
        let c = 0;
        let sum = 0;
        let elements: number[][] = [];
        while (-1 < i) {
            j = mat[0].length - 1;
            elements[i] = [];
            while (-1 < j) {
                c = this.cols - 1;
                sum = 0;
                while (-1 < c) {
                    sum += this.elements[i][c] * mat[c][j];
                    c = (c - 1) | 0;
                }
                elements[i][j] = sum;
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new Matrix(elements);
    }

    /**
     * Transpose Matrix
     */
    public transpose(): Matrix {
        let i = this.cols - 1;
        let j = 0;
        let elements: number[][] = [];
        while (-1 < i) {
            j = this.rows - 1;
            elements[i] = [];
            while (-1 < j) {
                elements[i][j] = this.elements[j][i];
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new Matrix(elements);
    }

    /**
     * Add bias vector
     * @param bias 
     */
    public addBias(bias: Vector): Matrix {
        if (bias.size !== this.cols) {
            throw new Error('invalid vector size');
        }

        let elements: number[][] = [];
        let i = this.rows - 1;
        let j = this.cols - 1;
        while (-1 < i) {
            elements[i] = [];
            while (-1 < j) {
                elements[i][j] = this.elements[i][j] + bias.at(j + 1);
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new Matrix(elements);
    }

    /**
     * Sum of each axis
     * @param axis 
     */
    public sum(axis: number = 0): Vector {
        let sums: number[] = [];
        let i = 0;
        let j = 0;
        if (axis == 0) {
            i = this.cols - 1;
            while (-1 < i) {
                sums[i] = 0;
                i = (i - 1) | 0;
            }
            i = this.rows - 1;
            while (-1 < i) {
                j = this.cols - 1;
                while (-1 < j) {
                    sums[j] += this.elements[i][j];
                    j = (j - 1) | 0;
                }
                i = (i - 1) | 0;
            }
            return Vector.create(sums);
        } else if (axis == 1) {
            i = this.rows - 1;
            while (-1 < i) {
                sums[i] = 0;
                i = (i - 1) | 0;
            }
            i = this.rows - 1;
            while (-1 < i) {
                j = this.cols - 1;
                while (-1 < j) {
                    sums[i] += this.elements[i][j];
                    j = (j - 1) | 0;
                }
                i = (i - 1) | 0;
            }
            return Vector.create(sums);
        }
        return new Vector([]);
    }

    /**
     * Mean
     * @param axis 
     */
    public mean(axis: number = 0): Vector {
        if (axis == 0) {
            return this.sum(axis).multiply(1.0 / this.rows);
        } else if (axis == 1) {
            return this.sum(axis).multiply(1.0 / this.cols);
        }
        return new Vector([]);
    }

    /**
     * Max Element
     */
    public max(): number {
        let max = 0.0;
        let i = this.rows - 1;
        let j = 0;
        while (-1 < i) {
            while (-1 < j) {
                if (max < this.elements[i][j]) {
                    max = this.elements[i][j];
                }
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return max;
    }

    public append(matrix: Matrix): Matrix {
        if (this.cols !== matrix.cols) {
            throw new Error('invalid shape');
        }
        let elements = this.elements;
        for (let i = 0; i < matrix.rows; i++) {
            elements.push(matrix.elements[i]);
        }
        return new Matrix(elements);
    }

    /**
     * Log
     */
    public log(): Matrix {
        return this.map((x: number) => Math.log(x));
    }

    /**
     * Mapping Function for Matrix
     * @param fn 
     */
    public map(fn: Function): Matrix {
        const elements: number[][] = [];
        let i = this.rows - 1;
        let j = 0;
        while (-1 < i) {
            j = this.cols - 1;
            elements[i] = [];
            while (-1 < j) {
                elements[i][j] = fn.call(this, this.elements[i][j], i, j);
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new Matrix(elements);
    }

    /**
     * Setting Elements
     * @param elements 
     */
    private setElements(elements: number[][]) {
        let i = 0;
        let j = 0;
        if (elements[0] && typeof elements[0][0] !== undefined) {
            i = elements.length - 1;
            this.elements = [];
            while (-1 < i) {
                j = elements[i].length - 1;
                this.elements[i] = [];
                while (-1 < j) {
                    this.elements[i][j] = elements[i][j];
                }
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
    }

    public prewitt() {
        let energy = Matrix.zeros(this.rows, this.cols);
        let replicateElement = this.elements;
        replicateElement.unshift(replicateElement[0]);
        replicateElement.push(replicateElement[replicateElement.length - 1]);
        let y = replicateElement.length - 1;
        while (-1 < y) {
            replicateElement[y].unshift(replicateElement[y][0]);
            replicateElement[y].push(replicateElement[y][replicateElement[y].length - 1]);
            y = (y - 1) | 0;
        }
        y = replicateElement.length - 2;
        let x = 0;
        // horizontal [-1, 0, 1]
        while (0 < y) {
            x = replicateElement[y].length - 2;
            while (0 < x) {
                let res = 0;
                res -= replicateElement[y - 1][x - 1];
                res -= replicateElement[y][x - 1];
                res -= replicateElement[y + 1][x - 1];
                res += replicateElement[y - 1][x + 1];
                res += replicateElement[y][x + 1];
                res += replicateElement[y + 1][x + 1];
                energy.elements[y - 1][x - 1] = Math.abs(res);
                x = (x - 1) | 0;
            }
            y = (y - 1) | 0;
        }
        // vertical [-1, 0, 1]
        while (0 < y) {
            x = replicateElement[y].length - 2;
            while (0 < x) {
                let res = 0;
                res -= replicateElement[y - 1][x - 1];
                res -= replicateElement[y - 1][x];
                res -= replicateElement[y - 1][x + 1];
                res += replicateElement[y + 1][x - 1];
                res += replicateElement[y + 1][x];
                res += replicateElement[y + 1][x + 1];
                energy.elements[y - 1][x - 1] += Math.abs(res);
                x = (x - 1) | 0;
            }
            y = (y - 1) | 0;
        }
        return energy;
    }
}

/**
 * OtherMatrix Class
 * Element is three number
 */
export class ColorMatrix {
    public elements: number[][][];

    constructor(elements: number[][][]) {
        this.setElements(elements);
    }

    /** accessors */
    get shape(): number[] {
        const cols = (this.elements.length === 0) ? 0 : this.elements[0].length;
        return [this.elements.length, cols];
    }
    get rows(): number { return this.elements.length; }
    get cols(): number { return this.elements[0].length; }

    /**
     * Make random matrix
     * @param n 
     * @param m 
     * @param round 
     */
    static rand(n: number, m: number, round: boolean = false): ColorMatrix {
        if (round) {
            return ColorMatrix.zeros(n, m).map(Math.random).map(Math.round);
        } else {
            return ColorMatrix.zeros(n, m).map(Math.random);
        }
    }

    /**
     * Make zero filled matrix
     * @param n row 
     * @param m col
     */
    static zeros(n: number, m: number): ColorMatrix {
        return ColorMatrix.fill(n, m, [0, 0, 0]);
    }

    /**
     * Make one filled matrix
     * @param n 
     * @param m 
     */
    static ones(n: number, m: number): ColorMatrix {
        return ColorMatrix.fill(n, m, [1, 1, 1]);
    }

    /**
     * Make filled matrix by x
     * @param n 
     * @param m 
     * @param x 
     */
    static fill(n: number, m: number, x: number[]): ColorMatrix {
        const elements: number[][][] = [];
        let i = n - 1;
        let j = 0;
        while (-1 < i) {
            j = m - 1;
            elements[i] = [];
            while (-1 < j) {
                elements[i][j] = x;
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new ColorMatrix(elements);
    }

    /**
     * Matlab like padarray (padding array)
     * @param matrix 
     * @param size 
     * @param value 
     */
    static padarray(matrix: ColorMatrix, size: number[], value: number): ColorMatrix {
        let newMatrix = matrix;
        let hDiff = size[0];
        let wDiff = size[1];

        for (let y = 0; y < matrix.rows; y++) {
            for (let i = 0; i < wDiff; i++) {
                newMatrix.elements[y].push([value, value, value]);
            }
        }
        for (let i = 0; i < hDiff; i++) {
            let newRow: number[][] = [];
            for (let x = 0; x < matrix.cols + wDiff; x++) {
                newRow[x] = [value, value, value];
            }
            newMatrix.elements.push(newRow);
        }
        return newMatrix;
    }

    /**
     * 1-origin accessor
     * @param i 
     * @param j 
     */
    public at(i: number, j: number): number[] {
        return this.elements[i - 1][j - 1];
    }

    /**
     * Add two matrix
     * @param matrix 
     */
    public add(matrix: ColorMatrix): ColorMatrix {
        if (!this.isSameSizeAs(matrix)) {
            throw new Error('Matrix must be same shape');
        }
        return this.map((x: number[], i: number, j: number) => {
            [x[0] + matrix.elements[i][j][0],
            x[1] + matrix.elements[i][j][1],
            x[2] + matrix.elements[i][j][2]]
        });
    }

    /**
     * Subtract two matrix
     * @param matrix 
     */
    public subtract(matrix: ColorMatrix): ColorMatrix {
        if (!this.isSameSizeAs(matrix)) {
            throw new Error('Matrix must be same shape');
        }
        return this.map((x: number[], i: number, j: number) => {
            [x[0] - matrix.elements[i][j][0],
            x[1] - matrix.elements[i][j][1],
            x[2] - matrix.elements[i][j][2]]
        });
    }

    /**
     * Judge size
     * @param matrix 
     */
    private isSameSizeAs(matrix: ColorMatrix): boolean {
        return (this.rows === matrix.rows && this.cols === matrix.cols);
    }

    /**
     * Element-wise multiply operator
     * @param matrix 
     */
    public multiply(matrix: number | ColorMatrix): ColorMatrix {
        if (typeof matrix === 'number') {
            return this.map((x: number[]) => {
                [x[0] * matrix,
                x[1] * matrix,
                x[2] * matrix]
            });
        } else {
            let elements: number[][][] = [];
            let i = this.rows - 1;
            let j = 0;
            while (-1 < i) {
                j = this.cols - 1;
                elements[i] = [];
                while (-1 < j) {
                    elements[i][j] = [];
                    elements[i][j][0] = this.elements[i][j][0] * matrix.elements[i][j][0];
                    elements[i][j][1] = this.elements[i][j][1] * matrix.elements[i][j][1];
                    elements[i][j][2] = this.elements[i][j][2] * matrix.elements[i][j][2];
                    j = (j - 1) | 0;
                }
                i = (i - 1) | 0;
            }
            return new ColorMatrix(elements);
        }
    }

    /**
     * Dot operator
     * @param matrix 
     */
    public dot(matrix: ColorMatrix): ColorMatrix {
        if (this.cols !== matrix.rows) {
            throw new Error('invalid matrix shape');
        }
        let mat: number[][][] = matrix.elements;
        let i = this.rows - 1;
        let j = 0;
        let c = 0;
        let rsum = 0;
        let gsum = 0;
        let bsum = 0;
        let elements: number[][][] = [];
        while (-1 < i) {
            j = mat[0].length - 1;
            elements[i] = [];
            while (-1 < j) {
                c = this.cols - 1;
                rsum = 0;
                gsum = 0;
                bsum = 0;
                while (-1 < c) {
                    rsum += this.elements[i][c][0] * mat[c][j][0];
                    gsum += this.elements[i][c][1] * mat[c][j][1];
                    bsum += this.elements[i][c][2] * mat[c][j][2];
                    c = (c - 1) | 0;
                }
                elements[i][j][0] = rsum;
                elements[i][j][1] = gsum;
                elements[i][j][2] = bsum;
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new ColorMatrix(elements);
    }

    /**
     * Transpose Matrix
     */
    public transpose(): ColorMatrix {
        let i = this.cols - 1;
        let j = 0;
        let elements: number[][][] = [];
        while (-1 < i) {
            j = this.rows - 1;
            elements[i] = [];
            while (-1 < j) {
                elements[i][j] = this.elements[j][i];
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new ColorMatrix(elements);
    }

    /**
     * Sum of each axis
     * @param axis 
     */
    public sum(axis: number = 0): number[][] {
        let sums: number[][] = [];
        let i = 0;
        let j = 0;
        if (axis == 0) {
            i = this.cols - 1;
            while (-1 < i) {
                sums[i] = [0, 0, 0];
                i = (i - 1) | 0;
            }
            i = this.rows - 1;
            while (-1 < i) {
                j = this.cols - 1;
                while (-1 < j) {
                    sums[j][0] += this.elements[i][j][0];
                    sums[j][1] += this.elements[i][j][1];
                    sums[j][2] += this.elements[i][j][2];
                    j = (j - 1) | 0;
                }
                i = (i - 1) | 0;
            }
            return sums;
        } else if (axis == 1) {
            i = this.rows - 1;
            while (-1 < i) {
                sums[i] = [0, 0, 0];
                i = (i - 1) | 0;
            }
            i = this.rows - 1;
            while (-1 < i) {
                j = this.cols - 1;
                while (-1 < j) {
                    sums[i][0] += this.elements[i][j][0];
                    sums[i][1] += this.elements[i][j][1];
                    sums[i][2] += this.elements[i][j][2];
                    j = (j - 1) | 0;
                }
                i = (i - 1) | 0;
            }
            return sums;
        }
        return [];
    }

    public append(matrix: ColorMatrix): ColorMatrix {
        if (this.cols !== matrix.cols) {
            throw new Error('invalid shape');
        }
        let elements = this.elements;
        for (let i = 0; i < matrix.rows; i++) {
            elements.push(matrix.elements[i]);
        }
        return new ColorMatrix(elements);
    }

    /**
     * Mapping Function for Matrix
     * @param fn 
     */
    public map(fn: Function): ColorMatrix {
        const elements: number[][][] = [];
        let i = this.rows - 1;
        let j = 0;
        while (-1 < i) {
            j = this.cols - 1;
            elements[i] = [];
            while (-1 < j) {
                elements[i][j] = fn.call(this, this.elements[i][j], i, j);
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return new ColorMatrix(elements);
    }

    /**
     * Setting Elements
     * @param elements 
     */
    private setElements(elements: number[][][]) {
        let i = 0;
        let j = 0;
        if (elements[0] && typeof elements[0][0] !== undefined) {
            i = elements.length - 1;
            this.elements = [];
            while (-1 < i) {
                j = elements[i].length - 1;
                this.elements[i] = [];
                while (-1 < j) {
                    this.elements[i][j] = elements[i][j];
                }
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
    }

    public exportToMatrix(index: number): Matrix {
        let matrix = Matrix.zeros(this.rows, this.cols);
        let i = this.rows - 1;
        let j = 0;
        while (-1 < i) {
            j = this.cols - 1;
            while (-1 < j) {
                matrix.elements[i][j] = this.elements[i][j][index];
                j = (j - 1) | 0;
            }
            i = (i - 1) | 0;
        }
        return matrix;
    }
}
/**
     * Vector Class
     */
export class Vector {

    constructor(public elements: number[]) { }

    get size(): number { return this.elements.length; }

    /**
     * Create vector
     * @param elements 
     */
    static create(elements: number[]): Vector {
        return new Vector(elements.slice());
    }

    /**
     * Randomize Create Vector
     * @param n 
     */
    static rand(n: number): Vector {
        let elements: number[] = [];
        while (0 < n) {
            elements.push(Math.random());
            n = (n - 1) | 0;
        }
        return Vector.create(elements);
    }

    /**
     * Fill zero Vector
     * @param n 
     */
    static zeros(n: number): Vector {
        let elements: number[] = [];
        while (0 < n) {
            elements.push(0);
            n = (n - 1) | 0;
        }
        return Vector.create(elements);
    }

    /**
     * Arrangement Vector
     * @param n 
     */
    static arrange(n: number): Vector {
        let elements: number[] = [];
        for (let i = 0; i < n; i++) {
            elements[i] = i;
        }
        return Vector.create(elements);
    }

    static fill(n: number, value: number): Vector {
        let elements: number[] = [];
        for (let i = 0; i < n; i++) {
            elements[i] = value;
        }
        return Vector.create(elements);
    }

    /**
     * Clone vector
     */
    public clone(): Vector {
        return Vector.create(this.elements);
    }

    /**
     * 1-origin accessor
     * @param i 
     */
    public at(i: number): number {
        return this.elements[i - 1];
    }

    /**
     * Add vector
     * @param vector 
     */
    public add(vector: Vector): Vector | null {
        let v = vector.elements;
        if (this.size !== v.length) {
            return null;
        }
        return this.map((x: number, i: number) => x + v[i]);
    }

    /**
     * Subtract vector
     * @param vector 
     */
    public subtract(vector: Vector): Vector | null {
        let v = vector.elements;
        if (this.size !== v.length) {
            return null;
        }
        return this.map((x: number, i: number) => x - v[i]);
    }

    /**
     * Multiply scalar
     * @param k 
     */
    public multiply(k: number): Vector {
        return this.map((x: number) => x * k);
    }

    /**
     * Dot
     * @param vector 
     */
    public dot(vector: Vector): number | null {
        let product = 0;
        let n = this.size;
        if (n !== vector.size) {
            return null;
        }
        n -= 1;
        while (-1 < n) {
            product += this.elements[n] * vector.elements[n];
        }
        return product;
    }

    /**
     * Cross
     * @param vector 
     */
    public cross(vector: Vector): Vector | null {
        let b = vector.elements;
        if (this.size !== 3 || b.length !== 3) {
            return null;
        }
        let a = this.elements;
        return Vector.create([
            (a[1] * b[2]) - (a[2] * b[1]),
            (a[2] * b[0]) - (a[0] * b[2]),
            (a[0] * b[1]) - (a[1] * b[0])
        ]);
    }

    /**
     * Mean
     */
    public mean(): number {
        let sum = 0.0;
        let i = this.size - 1;
        while (-1 < i) {
            sum += this.elements[i];
        }
        return sum / this.size;
    }

    public append(vector: Vector): Vector {
        let elements = this.elements;
        for (let i = 0; i < vector.size; i++) {
            elements.push(vector.elements[i]);
        }
        return Vector.create(elements);
    }

    public map(fn: Function): Vector {
        let elements: number[] = [];
        this.forEach((x: number, i: number) => elements.push(fn.call(this, x, i)));
        return Vector.create(elements);
    }

    private forEach(fn: Function): void {
        for (let i = 0; i < this.size; i++) {
            fn.call(this, this.elements[i], i);
        }
    }
}
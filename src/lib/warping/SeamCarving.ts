import { min } from './Functions';
import * as linear from '../math/Matrix';

// const linear = require('../warping/Matrix');

export default class SeamCarving {

    constructor(public image: ImageData) {
    }

    public convertImage() {
        let matrix = linear.ColorMatrix.zeros(this.image.height, this.image.width);
        let y = this.image.height - 1;
        let x = 0;
        while (-1 < y) {
            x = this.image.width - 1;
            while (-1 < x) {
                matrix.elements[y][x][0] = this.image.data[(y * this.image.width + x) * 4];
                matrix.elements[y][x][1] = this.image.data[(y * this.image.width + x) * 4 + 1];
                matrix.elements[y][x][2] = this.image.data[(y * this.image.width + x) * 4 + 2];
            }
        }
        return matrix;
    }

    public convertMatrix(image: linear.ColorMatrix) {
        let newData: Uint8ClampedArray = new Uint8ClampedArray(image.rows * image.cols * 4);
        for (let y = 0; y < image.rows; y++) {
            for (let x = 0; x < image.cols; x++) {
                let base = (y * image.rows + x) * 4;
                newData[base] = image.elements[y][x][0];
                newData[base + 1] = image.elements[y][x][1];
                newData[base + 2] = image.elements[y][x][2];
                newData[base + 3] = 255;
            }
        }
        return new ImageData(newData, image.cols, image.rows);
    }

    public seamCarving(newSize: number[], image: linear.ColorMatrix) {
        const sizeReductionX = image.cols - newSize[0];
        const sizeReductionY = image.rows - newSize[1];
        const mmax = (a: number, b: number) => a < b ? b : a;
        image = this.seamCarvingReduce([mmax(0, sizeReductionX), mmax(0, sizeReductionY)], image);
        image = this.seamCarvingEnlarge([mmax(0, -sizeReductionX), mmax(0, -sizeReductionY)], image);
        return this.convertMatrix(image);
    }

    private seamCarvingReduce(sizeReduction: number[], image: linear.ColorMatrix) {
        if (sizeReduction[0] == 0 && sizeReduction[1] == 0) {
            return image;
        }
        const [T, transBitMask] = this.findTransportMatrix(sizeReduction[0], sizeReduction[1], image);
        console.log(T);
        return this.addOrDeleteSeams(transBitMask, sizeReduction, image, this.reduceImageByMask);
    }

    private seamCarvingEnlarge(sizeEnlarge: number[], image: linear.ColorMatrix) {
        if (sizeEnlarge[0] == 0 && sizeEnlarge[1] == 1) {
            return image;
        }
        const [T, transBitMask] = this.findTransportMatrix(sizeEnlarge[0], sizeEnlarge[1], image);
        console.log(T);
        return this.addOrDeleteSeams(transBitMask, sizeEnlarge, image, this.enlargeImageMask);
    }

    private findTransportMatrix(widthDiff: number, heightDiff: number, image: linear.ColorMatrix) {
        let T = linear.Matrix.zeros(heightDiff, widthDiff);
        let transBitMask = linear.Matrix.ones(heightDiff, widthDiff).multiply(-1);

        // check border area
        let imageNoRow = image;
        for (let i = 1; i < heightDiff; i++) {
            const energy = this.energyRGB(imageNoRow);
            const [optSeamMask, seamEnergyRow] = this.findOptSeam(energy.transpose());
            imageNoRow = this.reduceImageByMask(imageNoRow, optSeamMask as number[], false);
            transBitMask.elements[i][0] = 0;
            T.elements[i][0] = T.elements[i - 1][0] + (seamEnergyRow as number);
        }

        let imageNoColumn = image;
        for (let j = 1; j < widthDiff; j++) {
            const energy = this.energyRGB(imageNoColumn);
            const [optSeamMask, seamEnergyColumn] = this.findOptSeam(energy);
            imageNoColumn = this.reduceImageByMask(imageNoColumn, optSeamMask as number[], true);
            transBitMask.elements[0][j] = 1;

            T.elements[0][j] = T.elements[0][j - 1] + (seamEnergyColumn as number);
        }

        let energy = this.energyRGB(image);
        let [optSeamMaskRow, seamEnergyRow] = this.findOptSeam(energy.transpose());
        image = this.reduceImageByMask(image, optSeamMaskRow as number[], false);

        energy = this.energyRGB(image);
        let [optSeamMaskColumn, seamEnergyColumn] = this.findOptSeam(energy);
        image = this.reduceImageByMask(image, optSeamMaskColumn as number[], true);

        // internal part
        for (let i = 1; i < heightDiff; i++) {
            let imageWithoutRow = image;
            for (let j = 1; j < widthDiff; j++) {
                energy = this.energyRGB(imageWithoutRow);

                [optSeamMaskRow, seamEnergyRow] = this.findOptSeam(energy.transpose());
                imageNoRow = this.reduceImageByMask(imageWithoutRow, optSeamMaskRow as number[], false);

                [optSeamMaskColumn, seamEnergyColumn] = this.findOptSeam(energy);
                imageNoColumn = this.reduceImageByMask(imageWithoutRow, optSeamMaskColumn as number[], true);

                let ne1 = T.elements[i - 1][j] + (seamEnergyRow as number);
                let ne2 = T.elements[i][j - 1] + (seamEnergyColumn as number);
                let val: number;
                let ind: number;
                if (ne1 < ne2) {
                    val = ne1;
                    ind = 0;
                } else {
                    val = ne2;
                    ind = 1;
                }
                T.elements[i][j] = val;
                transBitMask.elements[i][j] = ind;

                imageWithoutRow = imageNoColumn;
            }

            energy = this.energyRGB(image);
            [optSeamMaskRow, seamEnergyRow] = this.findOptSeam(energy.transpose());
            image = this.reduceImageByMask(image, optSeamMaskRow as number[], false);
        }

        return [T, transBitMask];
    }

    private addOrDeleteSeams(transBitMask: linear.Matrix, sizeReduction: number[], image: linear.ColorMatrix, operation: Function) {
        let y = transBitMask.rows;
        let x = transBitMask.cols;

        for (let it = 0; it < sizeReduction[0] + sizeReduction[1]; it++) {
            const energy = this.energyRGB(image);
            if (transBitMask.at(y, x) == 0) {
                const [optSeamMask, seamEnergyRow] = this.findOptSeam(energy.transpose());
                console.log(seamEnergyRow);
                image = operation(image, optSeamMask, false);
                y = y - 1;
            } else {
                const [optSeamMask, seamEnergyColumn] = this.findOptSeam(energy);
                console.log(seamEnergyColumn);
                image = operation(image, optSeamMask, true);
                x = x - 1;
            }
        }

        return image;
    }

    private findOptSeam(energy: linear.Matrix) {
        let M = linear.Matrix.padarray(energy, [0, 1], Number.MAX_VALUE);

        let cols = M.cols;
        let rows = M.rows;
        for (let i = 1; i < rows; i++) {
            for (let j = 1; j < cols - 1; j++) {
                let ne1 = M.elements[i - 1][j - 1];
                let ne2 = M.elements[i - 1][j];
                let ne3 = M.elements[i - 1][j + 1];
                M.elements[i][j] += min(ne1, min(ne2, ne3));
            }
        }

        let val = Number.MAX_VALUE;
        let indJ = -1;
        for (let x = 0; x < cols; x++) {
            if (val > M.at(rows, x + 1)) {
                val = M.at(rows, x + 1);
                indJ = x;
            }
        }

        let seamEnergy = val;

        let optSeamMask: number[] = [];

        for (let i = rows - 1; i >= 1; i--) {
            optSeamMask[i] = indJ;
            let ne1 = M.at(i, indJ);
            let ne2 = M.at(i, indJ + 1);
            let ne3 = M.at(i, indJ + 2);
            let indIncr = 0;
            if (ne1 < ne2) {
                if (ne1 < ne3) {
                    val = ne1;
                    indIncr = 1;
                } else {
                    val = ne3;
                    indIncr = 3;
                }
            } else {
                if (ne2 < ne3) {
                    val = ne2;
                    indIncr = 2;
                } else {
                    val = ne3;
                    indIncr = 3;
                }
            }

            seamEnergy = seamEnergy + val;
            indJ = indJ + (indIncr - 2);
        }

        optSeamMask[0] = indJ;
        return [optSeamMask, seamEnergy];
    }

    private reduceImageByMask(image: linear.ColorMatrix, seamMask: number[], isVertical: boolean) {
        if (isVertical) {
            return this.reduceImageByMaskVertical(image, seamMask);
        } else {
            return this.reduceImageByMaskHorizontal(image, seamMask);
        }
    }

    private reduceImageByMaskVertical(image: linear.ColorMatrix, seamMask: number[]) {
        let imageReduced = linear.ColorMatrix.zeros(image.rows, image.cols - 1);
        // seamMaskをみて判断
        for (let y = 0; y < image.rows; y++) {
            let x1 = 0;
            for (let x = 0; x < image.cols; x++) {
                if (x !== seamMask[y]) {
                    imageReduced.elements[y][x1] = image.elements[y][x];
                    x1++;
                }
            }
        }
        return imageReduced;
    }

    private reduceImageByMaskHorizontal(image: linear.ColorMatrix, seamMask: number[]) {
        let imageReduced = linear.ColorMatrix.zeros(image.rows - 1, image.cols);
        for (let x = 0; x < image.cols; x++) {
            let y1 = 0;
            for (let y = 0; y < image.rows; y++) {
                if (y !== seamMask[x]) {
                    imageReduced.elements[y1][x] = image.elements[y][x];
                    y1++;
                }
            }
        }
        return imageReduced;
    }

    private enlargeImageMask(image: linear.ColorMatrix, seamMask: number[], isVertical: boolean) {
        if (isVertical) {
            return this.enlargeImageByMaskVertical(image, seamMask);
        } else {
            return this.enlargeImageByMaskHorizontal(image, seamMask);
        }
    }

    private enlargeImageByMaskVertical(image: linear.ColorMatrix, seamMask: number[]) {
        const avg = (image: linear.ColorMatrix, i: number, j: number, k: number): number => {
            return (image.elements[i][j - 1][k] + image.elements[i][j + 1][k]) / 2;
        };
        let imageEnlarged = linear.ColorMatrix.zeros(image.rows, image.cols + 1);
        for (let y = 0; y < image.rows; y++) {
            for (let x = 0; x < seamMask[y]; x++) {
                imageEnlarged.elements[y][x] = image.elements[y][x];
            }
            imageEnlarged.elements[y][seamMask[y]][0] = avg(image, y, seamMask[y], 0);
            imageEnlarged.elements[y][seamMask[y]][1] = avg(image, y, seamMask[y], 1);
            imageEnlarged.elements[y][seamMask[y]][2] = avg(image, y, seamMask[y], 2);
            for (let x = seamMask[y]; x < image.cols; x++) {
                imageEnlarged.elements[y][x + 1] = image.elements[y][x];
            }
        }
    }

    private enlargeImageByMaskHorizontal(image: linear.ColorMatrix, seamMask: number[]) {
        const avg = (image: linear.ColorMatrix, i: number, j: number, k: number): number => {
            return (image.elements[i - 1][j][k] + image.elements[i + 1][j][k]) / 2;
        };
        let imageEnlarged = linear.ColorMatrix.zeros(image.rows + 1, image.cols);
        for (let x = 0; x < image.cols; x++) {
            for (let y = 0; y < seamMask[x]; y++) {
                imageEnlarged.elements[y][x] = image.elements[y][x];
            }
            imageEnlarged.elements[seamMask[x]][x][0] = avg(image, seamMask[x], x, 0);
            imageEnlarged.elements[seamMask[x]][x][1] = avg(image, seamMask[x], x, 1);
            imageEnlarged.elements[seamMask[x]][x][2] = avg(image, seamMask[x], x, 2);
            for (let y = seamMask[x]; y < image.rows; y++) {
                imageEnlarged.elements[y + 1][x] = image.elements[y][x];
            }
        }
    }

    private energyRGB(I: linear.ColorMatrix): linear.Matrix {
        const redEnergy = this.energyGrey(I.exportToMatrix(0));
        const greenEnergy = this.energyGrey(I.exportToMatrix(1));
        const blueEnergy = this.energyGrey(I.exportToMatrix(2));
        return redEnergy.add(greenEnergy).add(blueEnergy);
    }

    private energyGrey(I: linear.Matrix): linear.Matrix {
        return I.prewitt();
    }
}
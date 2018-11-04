import { Vec4, Point, PointList, RegionPoint, Rect, Edge } from './Types';


const REFINE_NONE = 0;
// const REFINE_STD = 1;
const REFINE_ADV = 2;

const NOT_DEF = -1024.0;
const USED = 1;
const NOT_USED = 0;

const M_3_2_PI = (3 * Math.PI) / 2;
const M_2__PI = (2 * Math.PI);

const RELATIVE_ERROR_FACTOR = 100.0;

function doubleEqual(a: number, b: number) {
    if (a == b) {
        return true;
    }
    const diff = a - b;
    const absDiff = diff >= 0 ? diff : -diff;
    const aa = a >= 0 ? a : -a;
    const bb = b >= 0 ? b : -b;
    let absMax = (aa > bb) ? aa : bb;
    const MIN_VALUE = Number.MIN_VALUE;
    if (absMax < MIN_VALUE) {
        absMax = MIN_VALUE;
    }
    return (absDiff / absMax) <= (RELATIVE_ERROR_FACTOR * Number.EPSILON);
}

function angleDiffSigned(a: number, b: number) {
    let diff = a - b;
    const PI = Math.PI;
    while (diff <= -PI) {
        diff += M_2__PI;
    }
    while (diff > PI) {
        diff -= M_2__PI;
    }
    return diff;
}

const distSq = (x1: number, x2: number, y1: number, y2: number) => (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
const dist = (x1: number, x2: number, y1: number, y2: number) => Math.sqrt(distSq(x1, y1, x2, y2));

function angleDiff(a: number, b: number) {
    const value = angleDiffSigned(a, b);
    return value >= 0 ? value : -value;
}

const logGamma = (x: number) => x > 15.0 ? logGammaWindschitl(x) : logGammaLanczos(x);
const logGammaWindschitl = (x: number) => 0.918938533204673 + (x - 0.5) * Math.log(x) - x + 0.5 * x * Math.log(x * Math.sinh(1 / x) + 1 / (810.0 * Math.pow(x, 6.0)));
function logGammaLanczos(x: number): number {
    const q = [
        75122.6331530, 80916.6278952, 36308.2951477,
        8687.24529705, 1168.92649479, 83.8676043424,
        2.50662827511
    ];
    let a = (x + 0.5) * Math.log(x + 5.5) - (x + 5.5);
    let b = 0;
    for (let n = 0; n < 7; ++n) {
        a -= Math.log(x + n);
        b += q[n] * Math.pow(x, n);
    }
    return a + Math.log(b);
}

const M_LN10 = 2.30258509299404568402;

function AsmallerB_XoverY(a: Edge, b: Edge): number {
    if (a.p.x == b.p.x) {
        return a.p.y < b.p.y ? 1 : -1;
    } else {
        return a.p.x < b.p.x ? 1 : -1;
    }
}

export default class LSD {
    private image?: ImageData;
    private imageData?: Uint8ClampedArray;
    private width: number = 0;
    private height: number = 0;
    private list: PointList[] = [];
    private angles?: Float64Array;
    private modgrad?: Float64Array;
    private used?: Uint8Array;

    constructor(
        private refineType: number = REFINE_NONE, private scale: number = 0.8,
        private sigmaScale: number = 0.6, private quant: number = 2.0,
        private angTh: number = 22.5, private logEps: number = 0.0,
        private densityTh: number = 0.7, private nBins: number = 1024
    ) { }

    /**
     * detect image;
     * @param image 
     */
    public detect(image: ImageData) {
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        const lines = this.lsd();
        return lines;
    }

    public drawSegments(context: CanvasRenderingContext2D, lines: Vec4[], color: string = '#ff0000') {
        context.strokeStyle = color;
        context.lineWidth = 1;
        lines.forEach((vert: Vec4) => {
            context.beginPath();
            context.moveTo(vert.x1, vert.y1);
            context.lineTo(vert.x2, vert.y2);
            context.stroke();
            context.closePath();
        })
    }

    /**
     * lsd
     */
    public lsd(): Vec4[] {
        if (!this.image/* || !this.angles*/) {
            throw new Error('image and angles required');
        }
        let lines: Vec4[] = [];
        const prec = Math.PI * this.angTh / 180;
        const p = this.angTh / 180;
        const rho = this.quant / Math.sin(prec);
        if (this.scale != 1) {
            const sigma = this.scale < 1 ? this.sigmaScale / this.scale : this.sigmaScale;
            const sprec = 3;
            const h = Math.ceil(sigma * Math.sqrt(2 * sprec * Math.log(10.0)));
            const kSize = 1 + 2 * h;
            const reshaped = this.reshape(this.image);
            this.imageData = this.gaussianBlur(reshaped, kSize, sigma);
            this.computeLevelLineAngles(rho, this.nBins);
        } else {
            this.imageData = this.reshape(this.image);
            this.computeLevelLineAngles(rho, this.nBins);
        }

        const LOG_NT = 5 * (Math.log10(this.width) + Math.log10(this.height)) / 2 + Math.log10(11.0);
        const minRegSize = -LOG_NT / Math.log10(p);
        this.used = new Uint8Array(this.imageData.length);
        for (let i = 0, listSize = this.list.length; i < listSize; i++) {
            const point = this.list[i].p;
            if ((this.at(this.used, point) === NOT_USED) &&
                (this.at(this.angles!, point) !== NOT_DEF)) {
                let regAngle = 0.0;
                let reg: RegionPoint[] = [];
                regAngle = this.regionGrow(this.list[i].p, reg, regAngle, prec);
                if (reg.length < minRegSize) {
                    continue;
                }
                let rect = new Rect();
                this.region2Rect(reg, regAngle, prec, p, rect);
                let logNfa = -1;
                if (this.refineType > REFINE_NONE) {
                    if (!this.refine(reg, regAngle, prec, p, rect, this.densityTh)) {
                        continue;
                    }
                    if (this.refineType >= REFINE_ADV) {
                        logNfa = this.improveRect(rect);
                        if (logNfa <= this.logEps) {
                            continue;
                        }
                    }
                }
                rect.x1 += 0.5;
                rect.y1 += 0.5;
                rect.x2 += 0.5;
                rect.y2 += 0.5;
                lines.push(new Vec4(rect.x1, rect.y1, rect.x2, rect.y2));
            }
        }
        return lines;
    }

    private computeLevelLineAngles(threshold: number, nBins: number) {
        const imageData = this.imageData;
        if (!imageData) {
            throw new Error('imageData required');
        }
        const width = this.width;
        const height = this.height;
        this.angles = new Float64Array(imageData.length);
        this.modgrad = new Float64Array(imageData.length);
        this.angles = this.setRow(this.angles, height - 1, NOT_DEF);
        this.angles = this.setCol(this.angles, width - 1, NOT_DEF);
        let maxGrad = -1.0;
        for (let y = 0; y < height - 1; y++) {
            const step = y * width;
            const nextStep = (y + 1) * width;
            for (let x = 0; x < width - 1; x++) {
                const DA = imageData[x + 1 + nextStep] - imageData[x + step];
                const BC = imageData[x + 1 + step] - imageData[x + nextStep];
                const gx = DA + BC;
                const gy = DA - BC;
                const norm = Math.sqrt((gx * gx + gy * gy) / 4.0);
                this.modgrad[x + step] = norm;
                if (norm <= threshold) {
                    this.angles[x + step] = NOT_DEF;
                } else {
                    this.angles[x + step] = Math.atan2(gx, -gy);
                    if (norm > maxGrad) {
                        maxGrad = norm;
                    }
                }
            }
        }
        let rangeS: PointList[] = [];
        rangeS.length = nBins;
        let rangeE: PointList[] = [];
        rangeE.length = nBins;
        let count = 0;
        const binCoef = (maxGrad > 0) ? (nBins - 1) / maxGrad : 0;
        for (let y = 0; y < height - 1; y++) {
            let step = y * width;
            for (let x = 0; x < width - 1; x++) {
                let i = Math.floor(this.modgrad[x + step] * binCoef);
                if (!rangeE[i]) {
                    this.list[count] = new PointList();
                    rangeE[i] = rangeS[i] = this.list[count];
                    count++;
                } else {
                    this.list[count] = new PointList();
                    rangeE[i] = this.list[count];
                    rangeE[i].next = this.list[count];
                    count++;
                }
                rangeE[i].p = new Point(x, y);
                rangeE[i].next = null;
            }
        }
        let idx = nBins - 1;
        for (; idx > 0 && !rangeS[idx]; idx--) { }
        let start = rangeS[idx];
        let endIdx = idx;
        if (start) {
            while (idx > 0) {
                idx--;
                if (rangeS[idx]) {
                    rangeE[endIdx].next = rangeS[idx];
                    rangeE[endIdx] = rangeE[idx];
                    endIdx = idx;
                }
            }
        }
    }

    private regionGrow(s: Point, reg: RegionPoint[], regAngle: number, prec: number): number {
        if (!this.used || !this.angles || !this.modgrad) {
            throw new Error('used, angles and modgrad required');
        }
        let seed = new RegionPoint();
        seed.x = s.x;
        seed.y = s.y;
        seed.used = this.at(this.used, s);
        regAngle = this.at(this.angles, s);
        seed.angle = regAngle;
        seed.modgrad = this.at(this.modgrad, s);
        seed.used = USED;
        reg.push(seed);
        let sumdx = Math.cos(regAngle);
        let sumdy = Math.sin(regAngle);

        for (let i = 0; i < reg.length; i++) {
            const rpoint = reg[i];
            const xxMin = Math.max(rpoint.x - 1, 0);
            const xxMax = Math.min(rpoint.x + 1, this.width - 1);
            const yyMin = Math.max(rpoint.y - 1, 0);
            const yyMax = Math.min(rpoint.y + 1, this.height - 1);
            for (let yy = yyMin; yy <= yyMax; yy++) {
                const step = yy * this.width;
                for (let xx = xxMin; xx <= xxMax; xx++) {
                    let isUsed = this.used[xx + step];
                    if (isUsed != USED && this.isAligned(xx, yy, regAngle, prec)) {
                        const angle = this.angles[xx + step];
                        isUsed = USED;
                        this.used[xx + step] = USED;
                        let regionPoint = new RegionPoint(xx, yy, angle, this.modgrad[xx + step], isUsed);
                        reg.push(regionPoint);
                        sumdx += Math.cos(angle);
                        sumdy += Math.sin(angle);
                        regAngle = Math.atan2(sumdy, sumdx);
                    }
                }
            }
        }
        return regAngle;
    }

    private isAligned(x: number, y: number, theta: number, prec: number): boolean {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return false;
        }
        const a = this.angles![x + y * this.width];
        if (a === NOT_DEF) {
            return false;
        }
        let nTheta = theta - a;
        if (nTheta < 0) {
            nTheta = -nTheta;
        }
        if (nTheta > M_3_2_PI) {
            nTheta -= M_2__PI;
            if (nTheta < 0) {
                nTheta -= nTheta;
            }
        }
        return nTheta <= prec;
    }

    private region2Rect(reg: RegionPoint[], regAngle: number, prec: number, p: number, rect: Rect) {
        let x = 0;
        let y = 0;
        let sum = 0;
        for (let i = 0; i < reg.length; i++) {
            const pnt = reg[i];
            const weight = pnt.modgrad;
            x += pnt.x * weight;
            y += pnt.y * weight;
            sum += weight;
        }
        if (sum <= 0) {
            throw new Error('weighted sum must differ from 0');
        }
        x /= sum;
        y /= sum;
        const theta = this.getTheta(reg, x, y, regAngle, prec);
        const dx = Math.cos(theta);
        const dy = Math.sin(theta);
        let lMin = 0;
        let lMax = 0;
        let wMin = 0;
        let wMax = 0;
        for (let i = 0; i < reg.length; i++) {
            let regdx = reg[i].x - x;
            let regdy = reg[i].y - y;
            let l = regdx * dx + regdy * dy;
            let w = -regdx * dy + regdy * dx;
            if (l > lMax) {
                lMax = l;
            } else if (l < lMin) {
                lMin = l;
            }
            if (w > wMax) {
                wMax = w;
            } else if (w < wMin) {
                wMin = w;
            }
        }
        rect.x1 = x + lMin * dx;
        rect.y1 = y + lMin * dy;
        rect.x2 = x + lMax * dx;
        rect.y2 = y + lMax * dy;
        rect.width = wMax - wMin;
        rect.x = x;
        rect.y = y;
        rect.theta = theta;
        rect.dx = dx;
        rect.prec = prec;
        rect.p = p;
        if (rect.width < 1.0) {
            rect.width = 1.0;
        }
    }

    private getTheta(reg: RegionPoint[], x: number, y: number, regAngle: number, prec: number): number {
        let ixx = 0.0;
        let iyy = 0.0;
        let ixy = 0.0;
        for (let i = 0; i < reg.length; i++) {
            const regx = reg[i].x;
            const regy = reg[i].y;
            const weight = reg[i].modgrad;
            let dx = regx - x;
            let dy = regy - y;
            ixx += dy * dy * weight;
            iyy += dx * dx * weight;
            ixy -= dx * dy * weight;
        }
        let check = (doubleEqual(ixx, 0) && doubleEqual(iyy, 0) && doubleEqual(ixy, 0));
        if (check) {
            throw new Error('check if inertia matrix is null');
        }
        let lambda = 0.5 * (ixx + iyy - Math.sqrt((ixx - iyy) * (ixx - iyy) + 4.0 * ixy * ixy));
        let theta = (Math.abs(ixx) > Math.abs(iyy)) ? Math.atan2(lambda - ixx, ixy) : Math.atan2(ixy, lambda - iyy);
        if (angleDiff(theta, regAngle) > prec) {
            theta += Math.PI;
        }
        return theta;
    }

    private refine(reg: RegionPoint[], regAngle: number, prec: number, p: number, rect: Rect, densityTh: number): boolean {
        let density = reg.length / (dist(rect.x1, rect.y1, rect.x2, rect.y2) * rect.width);
        if (density >= densityTh) {
            return true;
        }
        let xc = reg[0].x;
        let yc = reg[0].y;
        const angC = reg[0].angle;
        let sum = 0;
        let sSum = 0;
        let n = 0;
        for (let i = 0; i < reg.length; i++) {
            reg[i].used = NOT_USED;
            if (dist(xc, yc, reg[i].x, reg[i].y) < rect.width) {
                const angle = reg[i].angle;
                let angD = angleDiff(angle, angC);
                sum += angD;
                sSum += angD * angD;
                n++;
            }
            let meanAngle = sum / n;
            let tau = 2.0 * Math.sqrt((sSum - 2.0 * meanAngle * sum) / n + meanAngle * meanAngle);
            this.regionGrow(new Point(reg[0].x, reg[0].y), reg, regAngle, tau);
            if (reg.length < 2) {
                return false;
            }
            this.region2Rect(reg, regAngle, prec, p, rect);
            density = reg.length / (dist(rect.x1, rect.y1, rect.x2, rect.y2) / rect.width);
            if (density < densityTh) {
                return this.reduceRegionRadius(reg, regAngle, prec, p, rect, density, densityTh);
            } else {
                return true;
            }
        }
        return false;
    }

    private reduceRegionRadius(reg: RegionPoint[], regAngle: number, prec: number, p: number, rect: Rect, density: number, densityTh: number): boolean {
        let xc = reg[0].x;
        let yc = reg[0].y;
        let radSq1 = distSq(xc, yc, rect.x1, rect.y1);
        let radSq2 = distSq(xc, yc, rect.x2, rect.y2);
        let radSq = radSq1 > radSq2 ? radSq1 : radSq2;
        while (density < densityTh) {
            radSq *= 0.75 * 0.75;
            for (let i = 0; i < reg.length; i++) {
                if (distSq(xc, yc, reg[i].x, reg[i].y) > radSq) {
                    reg[i].used = NOT_USED;
                    const tmp = reg[i];
                    reg[i] = reg[reg.length - 1];
                    reg[reg.length - 1] = tmp;
                    reg.pop();
                    --i;
                }
            }
            if (reg.length < 2) {
                return false;
            }
            this.region2Rect(reg, regAngle, prec, p, rect);
            density = reg.length / (dist(rect.x1, rect.y1, rect.x2, rect.y2) / rect.width);
        }
        return true;
    }

    private improveRect(rect: Rect): number {
        let delta = 0.5;
        let delta2 = delta / 2.0;
        let logNfa = this.rectNfa(rect);
        if (logNfa > this.logEps) {
            return logNfa;
        }
        let r = new Rect();
        r.copy(rect);
        for (let n = 0; n < 5; n++) {
            r.p /= 2;
            r.prec = r.p * Math.PI;
            let logNfaNew = this.rectNfa(rect);
            if (logNfaNew > logNfa) {
                logNfa = logNfaNew;
                rect.copy(r);
            }
        }
        if (logNfa > this.logEps) {
            return logNfa;
        }
        r.copy(rect);
        for (let n = 0; n < 5; n++) {
            if ((r.width - delta) >= 0.5) {
                r.width -= delta;
                let logNfaNew = this.rectNfa(r);
                if (logNfaNew > logNfa) {
                    rect.copy(r);
                    logNfa = logNfaNew;
                }
            }
        }
        if (logNfa > this.logEps) {
            return logNfa;
        }
        r.copy(rect);
        for (let n = 0; n < 5; n++) {
            if ((r.width - delta) >= 0.5) {
                r.x1 -= -r.dy * delta2;
                r.y1 -= r.dx * delta2;
                r.x2 -= -r.dy * delta2;
                r.y2 -= r.dx * delta2;
                r.width -= delta;
                let logNfaNew = this.rectNfa(r);
                if (logNfaNew > logNfa) {
                    rect.copy(r);
                    logNfa = logNfaNew;
                }
            }
        }
        if (logNfa > this.logEps) {
            return logNfa;
        }
        r.copy(rect);
        for (let n = 0; n < 5; n++) {
            if ((r.width - delta) >= 0.5) {
                r.p /= 2;
                r.prec = r.p * Math.PI;
                let logNfaNew = this.rectNfa(r);
                if (logNfaNew > logNfa) {
                    rect.copy(r);
                    logNfa = logNfaNew;
                }
            }
        }
        return logNfa;
    }

    private rectNfa(rect: Rect): number {
        let totalPts = 0;
        let algPts = 0;
        let halfWidth = rect.width / 2.0;
        let dyhw = rect.dy * halfWidth;
        let dxhw = rect.dx * halfWidth;
        let orderedX = [new Edge(), new Edge(), new Edge, new Edge()];
        let minY = orderedX[0];
        let maxY = orderedX[0];
        orderedX[0].p.x = rect.x1 - dyhw;
        orderedX[0].p.y = rect.y1 + dxhw;
        orderedX[1].p.x = rect.x2 - dyhw;
        orderedX[1].p.y = rect.y2 + dxhw;
        orderedX[2].p.x = rect.x2 + dyhw;
        orderedX[2].p.y = rect.y2 - dxhw;
        orderedX[3].p.x = rect.x1 + dyhw;
        orderedX[3].p.y = rect.y1 - dxhw;

        orderedX.sort(AsmallerB_XoverY);

        for (let i = 1; i < 4; i++) {
            if (minY.p.y > orderedX[i].p.y) {
                minY = orderedX[i];
            }
            if (maxY.p.y < orderedX[i].p.y) {
                maxY = orderedX[i];
            }
        }
        minY.taken = true;
        let leftmost: Edge | null = null;
        for (let i = 0; i < 4; i++) {
            if (!orderedX[i].taken) {
                if (!leftmost) {
                    leftmost = orderedX[i];
                } else if (leftmost.p.x > orderedX[i].p.x) {
                    leftmost = orderedX[i]
                }
            }
        }
        if (!leftmost) {
            throw new Error('failed calculate leftmost nfa');
        }
        leftmost.taken = true;
        let rightmost: Edge | null = null;
        for (let i = 0; i < 4; i++) {
            if (!orderedX[i].taken) {
                if (!rightmost) {
                    rightmost = orderedX[i];
                } else if (rightmost.p.x < orderedX[i].p.x) {
                    rightmost = orderedX[i];
                }
            }
        }
        if (!rightmost) {
            throw new Error('failed calculate rightmost nfa');
        }
        rightmost.taken = true;
        let tailp: Edge | null = null;
        for (let i = 0; i < 4; i++) {
            if (!orderedX[i].taken) {
                if (!tailp) {
                    tailp = orderedX[i];
                } else if (tailp.p.x > orderedX[i].p.x) {
                    tailp = orderedX[i]
                }
            }
        }
        if (!tailp) {
            throw new Error('failed calculate tailp nfa');
        }
        tailp.taken = true;
        let flstep = (minY.p.y != leftmost.p.y) ? (minY.p.x + leftmost.p.x) / (minY.p.y - leftmost.p.y) : 0;
        let slstep = (leftmost.p.y != tailp.p.x) ? (leftmost.p.x + tailp.p.x) / (leftmost.p.y - tailp.p.x) : 0;
        let frstep = (minY.p.y != rightmost.p.y) ? (minY.p.x - rightmost.p.x) / (minY.p.y - rightmost.p.y) : 0;
        let srstep = (rightmost.p.y != tailp.p.x) ? (rightmost.p.x - tailp.p.x) / (rightmost.p.y - tailp.p.x) : 0;
        let lstep = flstep;
        let rstep = frstep;
        let leftX = minY.p.x;
        let rightX = minY.p.x;
        let minIter = minY.p.y;
        let maxIter = maxY.p.y;
        for (let y = minIter; y <= maxIter; y++) {
            if (y < 0 || y >= this.height) {
                continue;
            }
            for (let x = leftX; x <= rightX; x++) {
                if (x < 0 || x >= this.width) {
                    continue;
                }
                totalPts++;
                if (this.isAligned(x, y, rect.theta, rect.prec)) {
                    algPts++;
                }
            }
            if (y >= leftmost.p.y) {
                lstep = slstep;
            }
            if (y >= rightmost.p.y) {
                rstep = srstep;
            }
            leftX += lstep;
            rightX += rstep;
        }
        return this.nfa(totalPts, algPts, rect.p);
    }

    private nfa(n: number, k: number, p: number): number {
        const LOG_NT = 5 * (Math.log10(this.width) + Math.log10(this.height)) / 2 + Math.log10(11.0);
        if (n == 0 || k == 0) {
            return -LOG_NT;
        }
        if (n == k) {
            return -LOG_NT - n * Math.log10(p);
        }
        let pTerm = p / (1 - p);
        let log1Term = (n + 1) - logGamma(k + 1) - logGamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1.0 - p);
        let term = Math.exp(log1Term);
        if (doubleEqual(term, 0)) {
            if (k > n * p) {
                return -log1Term / M_LN10 - LOG_NT;
            } else {
                return -LOG_NT;
            }
        }
        let binTail = term;
        let tolerance = 0.1;
        for (let i = k + 1; i <= n; i++) {
            let binTerm = (n - i + 1) / i;
            let multTerm = binTerm * pTerm;
            term *= multTerm;
            binTail += term;
            if (binTerm < 1) {
                let err = term * ((1 - Math.pow(multTerm, (n - i + 1))) / (1 - multTerm) - 1);
                if (err < tolerance * Math.abs(-Math.log10(binTail) - LOG_NT) * binTail) {
                    break;
                }
            }
        }
        return -Math.log10(binTail) - LOG_NT;
    }

    private gaussianBlur(imageData: Uint8ClampedArray, kSize: number, sigma: number): Uint8ClampedArray {
        let width = this.width;
        let height = this.height;
        let src = imageData;
        let ctx = document.createElement('canvas').getContext('2d');
        let tmpData = ctx!.createImageData(width, height);
        let kernel = this.getGaussianKernel(kSize, sigma);
        let r = (kSize - 1) / 2;
        let tmp = this.reshape(tmpData);
        let dst = new Uint8ClampedArray(tmp.length);
        // separate 2d-filter
        for (let y = 0; y < height; y++) {
            let step = y * width;
            for (let x = 0; x < width; x++) {
                let buff = 0;
                let i = x + step;
                let k = 0;
                for (let kx = -r; kx <= r; kx++) {
                    let px = x + kx;
                    if (px <= 0 || width <= px) {
                        px = x;
                    }
                    let j = px + step;
                    buff += src[j] * kernel[k];
                    k++;
                }
                tmp[i] = buff;
            }
        }
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let step = y * width;
                let buff = 0;
                let i = x + step;
                let k = 0;
                for (let ky = -r; ky <= r; ky++) {
                    let py = y + ky;
                    let kStep = ky * width;
                    if (py <= 0 || height <= py) {
                        py = y;
                        kStep = 0;
                    }
                    let j = i + kStep;
                    buff += tmp[j] * kernel[k];
                    k++;
                }
                dst[i] = buff;
            }
        }
        return dst;
    }

    private getGaussianKernel(kSize: number, sigma: number): number[] {
        // 1d-kernel
        let kernel: number[] = [];
        let sigmaX = sigma > 0 ? sigma : ((kSize - 1) * 0.5 - 1) * 0.3 + 0.8;
        let scale2X = -0.5 / (sigmaX * sigmaX);
        let sum = 0.0;
        for (let i = 0; i < kSize; i++) {
            let x = i - (kSize - 1) * 0.5;
            kernel[i] = Math.exp(scale2X * x * x);
            sum += kernel[i];
        }
        sum = 1. / sum;
        for (let i = 0; i < kSize; i++) {
            kernel[i] *= sum;
        }
        return kernel;
    }

    private reshape(image: ImageData) {
        let src = image.data;
        let reshaped = new Uint8ClampedArray(src.length / 4);
        let len = reshaped.length;
        for (let i = 0; i < len; i++) {
            reshaped[i] = src[i * 4];
        }
        return reshaped;
    }

    private at(data: Uint8Array | Float64Array, p: Point) {
        return data[p.x + (p.y * this.width)];
    }

    public row(data: Float64Array, rowIndex: number) {
        let i = rowIndex * this.width;
        return data.subarray(i, i + this.width);
    }

    private setRow(data: Float64Array, index: number, value: number) {
        let from = index * this.width;
        let to = from + this.width;
        for (let i = from; i < to; i++) {
            data[i] = value;
        }
        return data;
    }

    private setCol(data: Float64Array, index: number, value: number) {
        let to = this.height * this.width;
        let step = this.width;
        for (let i = index; i < to; i += step) {
            data[i] = value;
        }
        return data;
    }
}
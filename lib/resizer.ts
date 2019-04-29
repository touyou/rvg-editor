import { MultiResizer } from './multi_resizer/multiResizer';
import EditPoint from './editPoint';
import SeamCarver from './seamCarver';
import { RbfResizer } from './multi_resizer/newResizer';

type Key = {
  key: number;
  origin: number;
  scale: number;
  contentLength: number;
};

export class Resizer {
  constructor() { }

  getResizer(linear: boolean, editPoints: EditPoint[], seamCarver: SeamCarver) {
    if (linear) {
      let xKey: Key[] = [];
      let yKey: Key[] = [];
      for (const editPoint of editPoints) {
        xKey.push({
          key: editPoint.canvasWidth,
          origin: editPoint.x,
          scale: editPoint.hScale,
          contentLength: editPoint.contentWidth,
        });
        yKey.push({
          key: editPoint.canvasHeight,
          origin: editPoint.y,
          scale: editPoint.vScale,
          contentLength: editPoint.contentHeight,
        });
      }
      xKey.sort((a, b) => {
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;
        return 0;
      })
      yKey.sort((a, b) => {
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;
        return 0;
      })

      let originXKeys: number[][] = [];
      let originYKeys: number[][] = [];
      let widthKeys: number[][] = [];
      let heightKeys: number[][] = [];
      let scaleXKeys: number[][] = [];
      let scaleYKeys: number[][] = [];
      for (const key of xKey) {
        originXKeys.push([key.key, key.origin]);
        widthKeys.push([key.key, key.contentLength]);
        scaleXKeys.push([key.key, key.scale]);
      }
      for (const key of yKey) {
        originYKeys.push([key.key, key.origin]);
        heightKeys.push([key.key, key.contentLength]);
        scaleYKeys.push([key.key, key.scale]);
      }
      return new MultiResizer(seamCarver.image, {
        originXKeys: originXKeys,
        originYKeys: originYKeys,
        widthKeys: widthKeys,
        heightKeys: heightKeys,
        scaleXKeys: scaleXKeys,
        scaleYKeys: scaleYKeys,
        verticalSeamMap: seamCarver.consistentVerticalMap,
        horizontalSeamMap: seamCarver.consistentHorizontalMap,
      });
    } else {
      return new RbfResizer(seamCarver.image, editPoints);
    }
  }
}

import { MultiResizer } from './multi_resizer/multiResizer';
import EditPoint from './editPoint';
import SeamCarver from './seamCarver';
import { RbfResizer } from './multi_resizer/newResizer';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
      return new RbfResizer(seamCarver.image, editPoints, seamCarver.consistentHorizontalMap, seamCarver.consistentVerticalMap);
    }
  }

  saveFiles(linear: boolean, editPoints: EditPoint[], seamCarver: SeamCarver, path: string) {
    let metainfo;
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
      metainfo = {
        linear: true,
        keys: {
          originXKeys: originXKeys,
          originYKeys: originYKeys,
          widthKeys: widthKeys,
          heightKeys: heightKeys,
          scaleXKeys: scaleXKeys,
          scaleYKeys: scaleYKeys,
        },
        verticalSeamMap: seamCarver.consistentVerticalMap,
        horizontalSeamMap: seamCarver.consistentHorizontalMap,
      }
    } else {
      const resizer = new RbfResizer(seamCarver.image, editPoints, seamCarver.consistentHorizontalMap, seamCarver.consistentVerticalMap);
      metainfo = {
        linear: false,
        keys: editPoints.map(
          (value, _, __) => { return value.convertObject(); }
        ),
        weights: {
          originX: resizer.xWeight.toArray(),
          originY: resizer.yWeight.toArray(),
          hScale: resizer.hScaleWeight.toArray(),
          vScale: resizer.vScaleWeight.toArray(),
          contentWidth: resizer.widthWeight.toArray(),
          contentHeight: resizer.heightWeight.toArray(),
        },
        verticalSeamMap: seamCarver.consistentVerticalMap,
        horizontalSeamMap: seamCarver.consistentHorizontalMap,
      }
    }

    const imageData = seamCarver.image;
    const jsonText = JSON.stringify(metainfo);
    const zip = new JSZip();
    zip.file('metainfo.json', jsonText);

    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    zip.file('image.png', canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true });
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, path);
    })
  }
}

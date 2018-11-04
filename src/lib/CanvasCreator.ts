// const createCanvas = (path: string): HTMLCanvasElement => {
//   // 画像をPropsのパスから用意
//   const image = new Image();
//   image.src = path;
//   // キャンバスを作成
//   const canvas = document.createElement('canvas') as HTMLCanvasElement;
//   canvas.width = image.naturalWidth;
//   canvas.height = image.naturalHeight;
//   // キャンバスのコンテキストを取得
//   const context = canvas.getContext('2d') as CanvasRenderingContext2D;
//   // 画像をキャンバスに書き込み
//   context!.drawImage(image, 0, 0);

//   return canvas;
// }

// export = createCanvas;

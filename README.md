# RVG Editor

RVG (Responsive Variable size Graphics) Editor

## How to use rvg files

First, you must download `rvg-loader.js` and `worker_pako.js` (in `public/js` folder.)

Next, you should load `rvg-loader.js` like this.

```html
<script src="rvg-loader.js"></script>
```

Then you can use `r-img` tag.

```html
<r-img src="eagle-small.rvg"></r-img>
```

This tag do **not** support normal image format.

And you should also set responsive width and height to `r-img` tag and their parent elements.
(`display: block` is needed.)

```css
body,
html {
  width: 100vw;
  height: 100vh;
}

r-img {
  display: block;
  width: 50%;
  height: 50%;
}
```

So some code is still needed, but all you need is this. Yes, that's all.

## Publication

- レスポンシブWebデザインのための画像形式及び制作用インターフェース(WISS2019ロングティザー) [発表](https://youtu.be/FosdqqL5cMM?t=7031) [PDF](https://www.wiss.org/WISS2019Proceedings/longteaser/01.pdf)

## LICENCE

[MIT](./LICENSE)

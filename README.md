# RVG Editor

RVG(Responsive Variable Size Graphics) Editor.

## How to use rvg files

First, you must download `rvg-loader.js` and `worker_pako.js` file. And put them into same place.

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
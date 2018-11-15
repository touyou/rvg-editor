# Multisize Image Editor

MultiSize Image Format Editor.

## How to use msi files

First, you must download `multisize-imageloader.js` and `worker_pako.js` file. And put them into same place.

Next, you should load `multisize-imageloader.js` like this.

```html
<script src="multisize-imageloader.js"></script>
```

Then you can use `m-img` tag.

```html
<m-img src="eagle-small.msi"></m-img>
```

This tag do **not** support normal image format.

And you should also set responsive width and height to m-img tag and their parent elements.
(`display: block` is needed.)

```css
body,
html {
  width: 100vw;
  height: 100vh;
}

m-img {
  display: block;
  width: 50%;
  height: 50%;
}
```

So some code is still needed, but all you need is this. Yes, that's all.
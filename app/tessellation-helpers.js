let tessellationHelper = {};

tessellationHelper.createDefaultImageState = function createDefaultImageState(canvas, img, clipPath) {
  img.selectable = false;
  img.clipPath = clipPath;
  canvas.add(img);
  canvas.sendToBack(img);
}

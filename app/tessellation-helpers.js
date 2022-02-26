let tessellationHelper = {};

tessellationHelper.createImage = function createImage(canvas, img, record) {
  img.left = record.imageX - (img.width / 2);
  img.top = record.imageY - (img.height / 2);
  img.selectable = false;
  img.clipPath = record.clipPath;
  canvas.add(img);
  canvas.sendToBack(img);
}

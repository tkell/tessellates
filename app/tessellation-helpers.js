let tessellationHelper = {};

tessellationHelper.createImage = function (canvas, img, record) {
  img.left = record.imageX - (img.width / 2);
  img.top = record.imageY - (img.height / 2);
  img.selectable = false;
  img.clipPath = record.clipPath;
  canvas.add(img);
  canvas.sendToBack(img);
}

tessellationHelper.createDefaultClickState = function (canvas, objectToClick, record) {
  objectToClick.on('mousedown', function(options) {
    var t = document.getElementById('text');
    t.textContent = record.title;
  });

  canvas.add(objectToClick);
  canvas.bringToFront(objectToClick);
}

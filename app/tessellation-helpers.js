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

tessellationHelper.createClickableMask = function (fabricKlass, record, width, height, polygonPoints) {
  let params = {
      left: record.clickX,
      top: record.clickY,
      angle: record.angle,
      perPixelTargetFind: true,
      fill: 'white',
      opacity: 0.001,
      width: width,
      height: height,
      selectable: false
  }

  if (!polygonPoints) {
    return new fabricKlass(params);
  } else {
    return new fabricKlass(polygonPoints, params);
  }
}

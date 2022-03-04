let tessellationHelper = {};

tessellationHelper.createImage = function (canvas, img, record) {
  img.left = record.imageX - (img.width / 2);
  img.top = record.imageY - (img.height / 2);
  img.selectable = false;
  img.clipPath = record.clipPath;
  canvas.add(img);
  canvas.sendToBack(img);
  return img;
}

tessellationHelper.createDefaultClickState = function (canvas, objectToClick, matchingImg, record) {
  objectToClick.on('mouseover', function(options) {
    var t = document.getElementById('text');
    t.textContent = record.title;
  });

  objectToClick.on('mousedown', function(options) {
    var t = document.getElementById('text');
    t.textContent = `${record.artist} - ${record.title} [${record.label}]`;
    matchingImg.animate('angle', 360, {
      onChange: canvas.renderAll.bind(canvas),
      onComplete: function() {
        matchingImg.angle = 0;
        matchingImg.filters.push(new fabric.Image.filters.Grayscale());
        matchingImg.applyFilters();
        matchingImg.clipPath = record.clipPath;
        canvas.insertAt(matchingImg, 0);
      }
    });
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

let tessellationHelper = {};

tessellationHelper.createImage = function (img, record) {
  img.left = record.imageX - (img.width / 2);
  img.top = record.imageY - (img.height / 2);
  img.selectable = false;
  img.clipPath = record.clipPath;
  return img;
}

// switch SQUARE and TRIANGLE to use this one!
tessellationHelper.createAndRenderImage = function (canvas, record) {
  record.image.left = record.imageX - (record.image.width / 2);
  record.image.top = record.imageY - (record.image.height / 2);
  record.image.selectable = false;
  record.image.clipPath = record.clipPath;
  canvas.add(record.image);
  canvas.sendToBack(record.image);
  return record.image;
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

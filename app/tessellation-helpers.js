let tessellationHelper = {};

tessellationHelper.createAndRenderImage = function (canvas, record) {
  record.image.left = record.imageX - (record.image.width / 2);
  record.image.top = record.imageY - (record.image.height / 2);
  record.image.selectable = false;
  record.image.clipPath = record.clipPath;
  canvas.add(record.image);
  canvas.sendToBack(record.image);
  return record.image;
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

function mouseOverTextUpdate(record, data) {
  return function() {
    if (data.currentBigImage === undefined) {
      var t = document.getElementById('text');
      t.textContent = record.title;
    }
  }
}

function mouseDownTextUpdate(record) {
  return function() {
    var t = document.getElementById('text');
    t.textContent = `${record.artist} - ${record.title} [${record.label}]`;
  }
}

function clearImageFilters(record) {
  return function() {
    record.image.filters = [];
    record.image.applyFilters();
  }
}

function setGreyscaleImageFilters(data) {
  return function() {
    for (let record of data) {
      record.image.filters.push(new fabric.Image.filters.Grayscale());
      record.image.applyFilters();
    }
  }
}

function makeBounce(record) {
  return function() {
    if (record.isAnimating === false) {
      let bounce = animationHelper.makeBounce(record);
      bounce();
    }
  }
}

function displayBigImage(record, data, canvas) {
  return function() {
    canvas.remove(data.currentBigImage);
    record.bigImage.left = record.bigImageX - (record.bigImage.width / 2)
    record.bigImage.top = record.bigImageY - (record.bigImage.height / 2)
    record.bigImage.selectable = false;
    record.bigImage.clipPath = record.bigClipPath;
    canvas.add(record.bigImage);
    canvas.bringToFront(record.bigImage);
    data.currentBigImage = record.bigImage;

    record.bigImage.on('mousedown', removeBigImage(data, canvas));
  }
}

function removeBigImage(data, canvas) {
  return function() {
      canvas.remove(data.currentBigImage);
      data.currentBigImage = undefined;
      for (let record of data) {
        record.image.filters = [];
        record.image.applyFilters();
      }
  }
}


tessellationHelper.createDefaultClickState = function (canvas, record, data) {
  let objectToClick = record.clickable;
  let matchingImg = record.image;
  objectToClick.on('mouseover', mouseOverTextUpdate(record, data));
  objectToClick.on('mouseover', makeBounce(record));

  objectToClick.on('mousedown', mouseDownTextUpdate(record));

  objectToClick.on('mousedown', clearImageFilters(record));
  objectToClick.on('mousedown', displayBigImage(record, data, canvas));
  objectToClick.on('mousedown', setGreyscaleImageFilters(data));

  canvas.add(objectToClick);
  canvas.bringToFront(objectToClick);
}
